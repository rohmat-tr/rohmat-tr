const SPREADSHEET_ID = "ID";

const SHEET_DEFINITIONS = [
  {
    name: "DIPA",
    headers: ["Tahun", "Nomor", "Kode KRO"],
  },
  {
    name: "POK_raw",
    headers: ["KODE", "URAIAN", "JUMLAH BIAYA", "SD/CP"],
  },
  {
    name: "POK_Normal",
    headers: [
      "UUID",
      "KodeProgram",
      "KRO",
      "Subkomponen",
      "KodeAkun",
      "UraianDetail",
      "JumlahBiaya",
      "FA",
      "SD_CP",
      "STATUS",
    ],
  },
  {
    name: "Master_KRO",
    headers: ["kode_KRO", "Bidang", "PIC", "KaTIM"],
  },
  {
    name: "Master_User",
    headers: ["Username", "Password", "Nama Lengkap", "Role", "open"],
  },
  {
    name: "Master_PPK",
    headers: ["PPK_Nama", "KRO", "SK_PPK"],
  },
  {
    name: "RPD",
    headers: [
      "RPD_ID",
      "UUID",
      "KRO",
      "Bulan",
      "Nilai",
      "Jenis",
      "Versi",
      "Aktif",
      "Catatan",
      "PIC",
      "Timestamp",
    ],
  },
  {
    name: "Realisasi",
    headers: [
      "Realisasi_ID",
      "Bukti_ID",
      "Tanggal_Bukti",
      "Bulan",
      "UUID",
      "KRO",
      "Nilai",
      "PIC",
      "Timestamp",
    ],
  },
  {
    name: "Bukti",
    headers: [
      "Bukti_ID",
      "Tanggal",
      "Nomor",
      "Jenis",
      "FileURL",
      "Primary_UUID",
      "KRO",
      "PIC",
      "Timestamp",
    ],
  },
  {
    name: "Audit_Log",
    headers: [
      "Timestamp",
      "User",
      "Role",
      "Modul",
      "Aksi",
      "Keterangan",
    ],
  },
];

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("RPD App")
    .addItem("Create/Refresh Sheets", "createSheets")
    .addToUi();
}

function createSheets() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  SHEET_DEFINITIONS.forEach((definition) => {
    const sheet = ensureSheet_(spreadsheet, definition.name);
    ensureHeaders_(sheet, definition.headers);
  });
}

function doGet() {
  const html = HtmlService.createTemplateFromFile("Index");
  html.userProfile = getUserProfile_();
  html.sheetNames = SHEET_DEFINITIONS.map((definition) => definition.name);
  return html
    .evaluate()
    .setTitle("RPD Management")
    .addMetaTag("viewport", "width=device-width, initial-scale=1");
}

function include_(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function login(username, password) {
  const masterSheet = getSheetByName_("Master_User");
  const data = masterSheet.getDataRange().getValues();
  const rows = data.slice(1);
  const match = rows.find(
    (row) =>
      String(row[0]).toLowerCase() === String(username).toLowerCase() &&
      String(row[1]) === String(password)
  );

  if (!match) {
    throw new Error("Username atau password salah.");
  }

  const profile = {
    username: match[0],
    fullName: match[2] || "",
    role: match[3] || "user",
    open: match[4] || "",
    allowed: true,
  };

  const properties = PropertiesService.getUserProperties();
  properties.setProperty("rpd_user", JSON.stringify(profile));

  return profile;
}

function logout() {
  PropertiesService.getUserProperties().deleteProperty("rpd_user");
  return { success: true };
}

function getUserProfile_() {
  const storedProfile = readStoredProfile_();
  if (!storedProfile) {
    return {
      username: "",
      fullName: "",
      role: "guest",
      open: "",
      allowed: false,
      message: "Silakan login untuk melanjutkan.",
    };
  }

  return {
    username: storedProfile.username,
    fullName: storedProfile.fullName,
    role: storedProfile.role,
    open: storedProfile.open,
    allowed: true,
    message: "",
  };
}

function listSheets() {
  authorizeRequest_();
  return SHEET_DEFINITIONS.map((definition) => definition.name);
}

function getSheetData(sheetName) {
  authorizeRequest_();
  const definition = getDefinition_(sheetName);
  const sheet = getSheetByName_(sheetName);
  const range = sheet.getDataRange();
  const values = range.getValues();
  const headers = definition.headers;
  const rows = values.slice(1).map((row, index) => ({
    rowId: index + 2,
    values: headers.map((_, colIndex) => row[colIndex] || ""),
  }));
  return {
    headers,
    rows,
  };
}

function createRecord(sheetName, record) {
  authorizeRequest_();
  const definition = getDefinition_(sheetName);
  const sheet = getSheetByName_(sheetName);
  const rowValues = definition.headers.map((header) => record[header] || "");
  sheet.appendRow(rowValues);
  return { success: true };
}

function updateRecord(sheetName, rowId, record) {
  authorizeRequest_();
  const definition = getDefinition_(sheetName);
  const sheet = getSheetByName_(sheetName);
  const rowValues = definition.headers.map((header) => record[header] || "");
  sheet.getRange(rowId, 1, 1, rowValues.length).setValues([rowValues]);
  return { success: true };
}

function deleteRecord(sheetName, rowId) {
  authorizeRequest_();
  const sheet = getSheetByName_(sheetName);
  sheet.deleteRow(rowId);
  return { success: true };
}

function ensureSheet_(spreadsheet, name) {
  let sheet = spreadsheet.getSheetByName(name);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(name);
  }
  return sheet;
}

function ensureHeaders_(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);
    return;
  }

  const existingHeaders = sheet
    .getRange(1, 1, 1, headers.length)
    .getValues()[0];
  const hasAllHeaders = headers.every(
    (header, index) => existingHeaders[index] === header
  );

  if (!hasAllHeaders) {
    sheet
      .getRange(1, 1, 1, headers.length)
      .setValues([headers]);
  }

  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers.length);
}

function authorizeRequest_() {
  const profile = getUserProfile_();
  if (!profile.allowed) {
    throw new Error(profile.message || "Akses ditolak.");
  }
}

function getDefinition_(sheetName) {
  const definition = SHEET_DEFINITIONS.find(
    (item) => item.name === sheetName
  );
  if (!definition) {
    throw new Error("Sheet tidak terdaftar.");
  }
  return definition;
}

function getSheetByName_(sheetName) {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    throw new Error("Sheet tidak ditemukan.");
  }
  return sheet;
}

function readStoredProfile_() {
  const properties = PropertiesService.getUserProperties();
  const rawProfile = properties.getProperty("rpd_user");
  if (!rawProfile) {
    return null;
  }

  try {
    return JSON.parse(rawProfile);
  } catch (error) {
    properties.deleteProperty("rpd_user");
    return null;
  }
}
