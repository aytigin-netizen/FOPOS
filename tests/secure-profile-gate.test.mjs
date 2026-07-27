import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const route = await readFile(
  new URL("../app/api/profile/route.ts", import.meta.url),
  "utf8",
);
const repository = await readFile(
  new URL("../db/teacher-workspace.ts", import.meta.url),
  "utf8",
);
const recordRoute = await readFile(
  new URL("../app/api/pedagogical-records/route.ts", import.meta.url),
  "utf8",
);
const recordRepository = await readFile(
  new URL("../db/pedagogical-records.ts", import.meta.url),
  "utf8",
);
const client = await readFile(
  new URL("../app/ClientApp.tsx", import.meta.url),
  "utf8",
);
const recordMigration = await readFile(
  new URL("../drizzle/0001_colorful_hex.sql", import.meta.url),
  "utf8",
);
const archiveModule = await readFile(
  new URL("../app/modules/record-archive/RecordArchiveModule.tsx", import.meta.url),
  "utf8",
);
const navigation = await readFile(
  new URL("../app/components/navigation/AppNavigation.tsx", import.meta.url),
  "utf8",
);
const exportRoute = await readFile(
  new URL("../app/api/account-export/route.ts", import.meta.url),
  "utf8",
);
const exportRepository = await readFile(
  new URL("../db/account-export.ts", import.meta.url),
  "utf8",
);
const dataManagementRoute = await readFile(
  new URL("../app/api/account-data-management/route.ts", import.meta.url),
  "utf8",
);
const dataManagementRepository = await readFile(
  new URL("../db/account-data-management.ts", import.meta.url),
  "utf8",
);
const accountClosureRoute = await readFile(
  new URL("../app/api/account-closure/route.ts", import.meta.url),
  "utf8",
);
const accountClosureRepository = await readFile(
  new URL("../db/account-closure.ts", import.meta.url),
  "utf8",
);
const retentionMigration = await readFile(
  new URL("../drizzle/0002_sour_polaris.sql", import.meta.url),
  "utf8",
);
const profileRevisionMigration = await readFile(
  new URL("../drizzle/0003_worthless_ezekiel_stane.sql", import.meta.url),
  "utf8",
);
const academicYearArchiveMigration = await readFile(
  new URL("../drizzle/0004_panoramic_shooting_star.sql", import.meta.url),
  "utf8",
);
const profileSettingsModule = await readFile(
  new URL(
    "../app/modules/profile-settings/ProfileSettingsModule.tsx",
    import.meta.url,
  ),
  "utf8",
);
const classWorkspaceRoute = await readFile(
  new URL("../app/api/class-workspaces/route.ts", import.meta.url),
  "utf8",
);
const classWorkspaceRepository = await readFile(
  new URL("../db/class-workspaces.ts", import.meta.url),
  "utf8",
);
const classWorkspaceModule = await readFile(
  new URL("../app/modules/class-workspaces/ClassWorkspacesModule.tsx", import.meta.url),
  "utf8",
);
const classWorkspaceEmptyState = await readFile(
  new URL("../app/components/workspace/ClassWorkspaceEmptyState.tsx", import.meta.url),
  "utf8",
);
const classWorkspaceMigration = await readFile(
  new URL("../drizzle/0005_goofy_spectrum.sql", import.meta.url),
  "utf8",
);
const rosterModule = await readFile(
  new URL("../app/modules/student-rosters/StudentRostersModule.tsx", import.meta.url),
  "utf8",
);
const analysisModule = await readFile(
  new URL("../app/modules/exam-analysis/ExamAnalysisModule.tsx", import.meta.url),
  "utf8",
);
const performanceModule = await readFile(
  new URL("../app/modules/student-performance/StudentPerformanceModule.tsx", import.meta.url),
  "utf8",
);
const hosting = JSON.parse(
  await readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
);

test("uygulama doğrulanmış ChatGPT oturumu olmadan açılmaz", () => {
  assert.match(page, /requireChatGPTUser\("\/"\)/);
  assert.match(page, /if \(!profile\)/);
  assert.match(page, /<ProfileSetup/);
});

test("profil yazımı kimlik ve aynı-origin kontrollerinden geçer", () => {
  assert.match(route, /getChatGPTUser/);
  assert.match(route, /status: 401/);
  assert.match(route, /request\.headers\.get\("origin"\)/);
  assert.match(route, /status: 403/);
  assert.doesNotMatch(route, /oai-authenticated-user-email.*body/s);
});

test("profil D1 üzerinde kullanıcıya özgü ve tekil saklanır", () => {
  assert.equal(hosting.d1, "DB");
  assert.match(repository, /WHERE user_id = \?/);
  assert.match(repository, /ON CONFLICT\(user_id\) DO NOTHING/);
  assert.match(repository, /schema_version/);
  assert.doesNotMatch(repository, /localStorage|sessionStorage/);
});

test("pedagojik kayıt yazımı doğrulanmış oturum ve aynı-origin ister", () => {
  assert.match(recordRoute, /getChatGPTUser/);
  assert.match(recordRoute, /status: 401/);
  assert.match(recordRoute, /request\.headers\.get\("origin"\)/);
  assert.match(recordRoute, /status: 403/);
  assert.match(recordRoute, /ensureWorkspaceAccount\(user\.email\)/);
});

test("hesap kayıtları kullanıcı, revizyon ve değişmez içerikle korunur", () => {
  assert.match(
    recordMigration,
    /UNIQUE INDEX `pedagogical_records_user_record_revision_idx`[\s\S]*`user_id`,`record_id`,`revision`/,
  );
  assert.match(recordRepository, /WHERE user_id = \? AND record_id = \? AND revision = \?/);
  assert.match(recordRepository, /SHA-256/);
  assert.match(recordRepository, /draft: \["in_review"\]/);
  assert.match(recordRepository, /in_review: \["approved"\]/);
  assert.match(recordRepository, /record\.status === "approved" && !record\.approval/);
  assert.match(recordRepository, /previous\?\.revision !== record\.revision - 1/);
});

test("ders stüdyosu tarayıcı deposu yerine hesap API'sine yazar", () => {
  assert.match(client, /fetch\("\/api\/pedagogical-records"/);
  assert.match(client, /Hesabınıza kaydedildi/);
  assert.doesNotMatch(client, /localStorage|sessionStorage|saveRecordRevision/);
});

test("hesap arşivi menüden açılır ve yalnız oturum sahibinin kayıtlarını okur", () => {
  assert.match(navigation, /\["archive", "Kayıt Arşivi"/);
  assert.match(client, /<RecordArchiveModule/);
  assert.match(recordRoute, /export async function GET/);
  assert.match(recordRepository, /WHERE user_id = \?/);
  assert.match(archiveModule, /\/api\/pedagogical-records\?/);
});

test("v46 arşivi açık onayla kopyalanır ve yerel kayıt silinmez", () => {
  assert.match(archiveModule, /checked=\{confirmed\}/);
  assert.match(archiveModule, /disabled=\{!confirmed \|\| importing\}/);
  assert.match(archiveModule, /readRecordArchiveRecords\(window\.localStorage\)/);
  assert.match(archiveModule, /v46 yerel arşivi silinmedi/);
  assert.doesNotMatch(archiveModule, /clearRecordArchive|removeItem/);
  assert.match(recordRepository, /İçe aktarma paketi 1–200 revizyon içermelidir/);
});

test("hesap dışa aktarımı oturum, aynı-origin ve açık öğretmen onayı ister", () => {
  assert.match(exportRoute, /getChatGPTUser/);
  assert.match(exportRoute, /status: 401/);
  assert.match(exportRoute, /request\.headers\.get\("origin"\)/);
  assert.match(exportRoute, /status: 403/);
  assert.match(exportRoute, /confirmed\?: unknown/);
  assert.match(exportRoute, /confirmed !== true/);
  assert.match(exportRoute, /Cache-Control": "no-store"/);
  assert.match(exportRoute, /Content-Disposition/);
});

test("dışa aktarma paketi öğretmen verisini taşır, hassas alanları dışlar", () => {
  assert.match(exportRepository, /account: \{ email: account\.emailNormalized \}/);
  assert.match(exportRepository, /teacherProfile: publicProfile\(profile\)/);
  assert.match(exportRepository, /pedagogicalRecords/);
  assert.match(exportRepository, /contentSha256/);
  assert.match(exportRepository, /student_rosters/);
  assert.match(exportRepository, /student_scores/);
  assert.match(exportRepository, /bep_and_health_data/);
  assert.match(exportRepository, /session_tokens/);
  assert.match(exportRepository, /internal_database_ids/);
  assert.doesNotMatch(exportRepository, /userId:|profile\.id|account\.id[,}]/);
});

test("dışa aktarma düğmesi kapsam onayı verilmeden etkinleşmez", () => {
  assert.match(archiveModule, /checked=\{exportConfirmed\}/);
  assert.match(archiveModule, /disabled=\{!exportConfirmed \|\| exporting\}/);
  assert.match(archiveModule, /fetch\("\/api\/account-export"/);
  assert.match(archiveModule, /öğrenci listeleri, puanlar, BEP\/sağlık verileri/);
});

test("etkin kayıt sorguları silme alanındaki revizyonları dışlar", () => {
  assert.match(retentionMigration, /ADD `deleted_at` text/);
  assert.match(recordRepository, /deleted_at IS NULL/g);
  assert.match(
    recordRepository,
    /WHERE user_id = \? AND record_id = \? AND revision = \?[\s\S]*AND deleted_at IS NULL/,
  );
  assert.match(
    recordRepository,
    /UPDATE pedagogical_records[\s\S]*WHERE user_id = \? AND record_id = \? AND revision = \?[\s\S]*AND deleted_at IS NULL/,
  );
});

test("güvenli silme doğrulanmış oturum, aynı-origin ve çift onay ister", () => {
  assert.match(dataManagementRoute, /getChatGPTUser/);
  assert.match(dataManagementRoute, /status: 401/);
  assert.match(dataManagementRoute, /request\.headers\.get\("origin"\)/);
  assert.match(dataManagementRoute, /status: 403/);
  assert.match(dataManagementRoute, /input\.confirmed !== true/);
  assert.match(
    dataManagementRoute,
    /input\.confirmationText !== RECORD_DELETE_CONFIRMATION/,
  );
  assert.match(dataManagementRoute, /Number\.isInteger\(input\.expectedRevisionCount\)/);
});

test("silme ve geri yükleme yalnız doğrulanmış hesaba uygulanır", () => {
  assert.match(dataManagementRepository, /RECORD_TRASH_RETENTION_DAYS = 30/);
  assert.match(dataManagementRepository, /RECORD_DELETE_CONFIRMATION = "KAYITLARIMI SİL"/);
  assert.match(
    dataManagementRepository,
    /UPDATE pedagogical_records[\s\S]*WHERE user_id = \? AND deleted_at IS NULL/,
  );
  assert.match(
    dataManagementRepository,
    /UPDATE pedagogical_records[\s\S]*WHERE user_id = \? AND deleted_at IS NOT NULL/,
  );
  assert.match(
    dataManagementRepository,
    /DELETE FROM pedagogical_records[\s\S]*WHERE user_id = \?[\s\S]*deleted_at < \?/,
  );
  assert.match(dataManagementRepository, /activeRevisionCount !== expectedRevisionCount/);
});

test("öğretmen arayüzü silme kapsamını açıklar ve geri alma sunar", () => {
  assert.match(archiveModule, /checked=\{deleteConfirmed\}/);
  assert.match(archiveModule, /confirmationText !== "KAYITLARIMI SİL"/);
  assert.match(archiveModule, /fetch\("\/api\/account-data-management"/);
  assert.match(archiveModule, /Hesabınız ve öğretmen profiliniz bu işlemden etkilenmez/);
  assert.match(archiveModule, /v46 yerel arşiviniz ve indirdiğiniz dosyalar/);
  assert.match(archiveModule, /Kayıtları geri yükle/);
  assert.match(archiveModule, /30 günlük geri alma süresini anladım/);
});

test("kalıcı hesap silme oturum, aynı-origin ve üçlü doğrulama ister", () => {
  assert.match(accountClosureRoute, /getChatGPTUser/);
  assert.match(accountClosureRoute, /status: 401/);
  assert.match(accountClosureRoute, /request\.headers\.get\("origin"\)/);
  assert.match(accountClosureRoute, /status: 403/);
  assert.match(accountClosureRoute, /input\.confirmed !== true/);
  assert.match(
    accountClosureRoute,
    /input\.confirmationText !== ACCOUNT_DELETE_CONFIRMATION/,
  );
  assert.match(
    accountClosureRoute,
    /input\.accountEmail\.trim\(\)\.toLocaleLowerCase\("en-US"\)/,
  );
  assert.match(accountClosureRoute, /Number\.isInteger\(input\.expectedRecordRevisionCount\)/);
});

test("hesap kapatma yalnız doğrulanmış kullanıcının bağlı verilerini siler", () => {
  assert.match(
    accountClosureRepository,
    /ACCOUNT_DELETE_CONFIRMATION = "HESABIMI KALICI OLARAK SİL"/,
  );
  assert.match(
    accountClosureRepository,
    /DELETE FROM pedagogical_records WHERE user_id = \?/,
  );
  assert.match(
    accountClosureRepository,
    /DELETE FROM teacher_profiles WHERE user_id = \?/,
  );
  assert.match(accountClosureRepository, /DELETE FROM users WHERE id = \?/);
  assert.match(accountClosureRepository, /await db\.batch/);
  assert.match(
    accountClosureRepository,
    /summary\.recordRevisionCount !== expectedRecordRevisionCount/,
  );
});

test("hesap kapatma arayüzü geri alınamaz kapsamı açıkça gösterir", () => {
  assert.match(archiveModule, /fetch\("\/api\/account-closure"/);
  assert.match(archiveModule, /checked=\{accountDeleteConfirmed\}/);
  assert.match(
    archiveModule,
    /accountConfirmationText !== "HESABIMI KALICI OLARAK SİL"/,
  );
  assert.match(archiveModule, /accountEmailConfirmation\.trim\(\)/);
  assert.match(archiveModule, /30 günlük geri alma süresi bu işlem için geçerli değildir/);
  assert.match(archiveModule, /önce yukarıdaki JSON paketini/);
  assert.match(archiveModule, /window\.location\.assign\(payload\.signOutPath\)/);
});

test("profil düzenleme kimlik, aynı-origin ve revizyon kontrolü ister", () => {
  assert.match(route, /export async function PUT/);
  assert.match(route, /getChatGPTUser/);
  assert.match(route, /sameOrigin\(request\)/);
  assert.match(route, /status: 401/);
  assert.match(route, /status: 403/);
  assert.match(repository, /input\.expectedRevision !== current\.revision/);
  assert.match(
    repository,
    /WHERE user_id = \? AND revision = \?/,
  );
});

test("öğretim yılı geçişi açık onay ister ve kayıtları değiştirmez", () => {
  assert.match(
    repository,
    /ACADEMIC_YEAR_ROLLOVER_CONFIRMATION[\s\S]*"YENİ ÖĞRETİM YILINA GEÇ"/,
  );
  assert.match(repository, /yearChanged &&/);
  assert.match(repository, /input\.rolloverConfirmed !== true/);
  assert.match(
    repository,
    /input\.rolloverConfirmationText !== ACADEMIC_YEAR_ROLLOVER_CONFIRMATION/,
  );
  assert.doesNotMatch(
    repository,
    /UPDATE pedagogical_records[\s\S]*academic_year/,
  );
  assert.match(profileSettingsModule, /eski kayıtları silmez, yeniden yazmaz veya otomatik/);
});

test("profil revizyonları geçmişe dönük ve kullanıcıya özgü saklanır", () => {
  assert.match(profileRevisionMigration, /CREATE TABLE `teacher_profile_revisions`/);
  assert.match(
    profileRevisionMigration,
    /UNIQUE INDEX `teacher_profile_revisions_user_revision_idx`/,
  );
  assert.match(profileRevisionMigration, /INSERT INTO `teacher_profile_revisions`/);
  assert.match(profileRevisionMigration, /FROM `teacher_profiles`/);
  assert.match(repository, /INSERT INTO teacher_profile_revisions/);
  assert.match(repository, /WHERE user_id = \?/);
  assert.match(repository, /ORDER BY revision DESC/);
});

test("ayarlar ekranı profil düzenleme ve kontrollü yıl geçişi sunar", () => {
  assert.match(navigation, /view==="settings"/);
  assert.match(client, /<ProfileSettingsModule/);
  assert.match(profileSettingsModule, /fetch\("\/api\/profile"/);
  assert.match(profileSettingsModule, /method: "PUT"/);
  assert.match(profileSettingsModule, /checked=\{rolloverConfirmed\}/);
  assert.match(
    profileSettingsModule,
    /rolloverConfirmationText === "YENİ ÖĞRETİM YILINA GEÇ"/,
  );
  assert.match(profileSettingsModule, /disabled=\{!hasChanges \|\| !rolloverReady/);
  assert.match(profileSettingsModule, /Son profil revizyonları/);
});

test("mevcut pedagojik kayıtlar profil yılıyla geriye dönük etiketlenir", () => {
  assert.match(
    academicYearArchiveMigration,
    /ADD `academic_year` text/,
  );
  assert.match(
    academicYearArchiveMigration,
    /UPDATE `pedagogical_records`[\s\S]*FROM `teacher_profiles`[\s\S]*`teacher_profiles`\.`user_id` = `pedagogical_records`\.`user_id`/,
  );
  assert.match(
    academicYearArchiveMigration,
    /pedagogical_records_user_year_updated_idx/,
  );
});

test("yeni kayıtlar yalnız etkin profil öğretim yılına bağlanır", () => {
  assert.match(recordRepository, /async function currentAcademicYear/);
  assert.match(recordRepository, /FROM teacher_profiles[\s\S]*WHERE user_id = \?/);
  assert.match(
    recordRepository,
    /payload_json, academic_year, created_at, updated_at, deleted_at/,
  );
  assert.match(recordRepository, /\.bind\([\s\S]*academicYear,[\s\S]*record\.createdAt/);
  assert.match(
    recordRepository,
    /farklı bir öğretim yılına aittir ve yerinde değiştirilemez/,
  );
});

test("arşiv sorguları öğretim yılı ve doğrulanmış kullanıcıyla sınırlandırılır", () => {
  assert.match(recordRoute, /searchParams\.get\("scope"\) === "archive"/);
  assert.match(recordRoute, /searchParams\.get\("academicYear"\)/);
  assert.match(recordRoute, /listAcademicYearArchive\(account\.id, academicYear\)/);
  assert.match(
    recordRepository,
    /WHERE user_id = \? AND academic_year = \?[\s\S]*AND deleted_at IS NULL/,
  );
  assert.match(recordRepository, /COUNT\(DISTINCT record_id\) AS record_count/);
  assert.match(recordRepository, /İstenen öğretim yılı arşivde bulunamadı/);
});

test("kayıt arşivi etkin ve geçmiş yılları değiştirmeden filtreler", () => {
  assert.match(archiveModule, /scope: "archive"/);
  assert.match(archiveModule, /value=\{selectedAcademicYear\}/);
  assert.match(archiveModule, /void loadRecords\(event\.target\.value\)/);
  assert.match(archiveModule, /Etkin yıl/);
  assert.match(archiveModule, /Geçmiş yıl/);
  assert.match(
    archiveModule,
    /Yeni öğretim[\s\S]*yılına kopyalanmaz, değiştirilmez veya yeniden onaylanmaz/,
  );
});

test("hesap dışa aktarımı kayıtların öğretim yılı eşlemesini korur", () => {
  assert.match(exportRepository, /listPedagogicalRecordYearAssignments/);
  assert.match(exportRepository, /pedagogicalRecordAcademicYears/);
  assert.match(recordRepository, /SELECT record_id, revision, academic_year/);
});

test("sınıf çalışma alanları kullanıcı ve öğretim yılına özgüdür", () => {
  assert.match(classWorkspaceMigration, /CREATE TABLE `class_workspaces`/);
  assert.match(classWorkspaceRepository, /subject_code/);
  assert.match(classWorkspaceRepository, /WHERE user_id = \? AND academic_year = \?/);
  assert.match(classWorkspaceRepository, /WHERE id = \? AND user_id = \? AND academic_year = \?/);
  assert.match(classWorkspaceRepository, /value !== 10 && value !== 11/);
});

test("sınıf çalışma alanı yazımı oturum ve aynı-origin ister", () => {
  assert.match(classWorkspaceRoute, /getChatGPTUser/);
  assert.match(classWorkspaceRoute, /status: 401/);
  assert.match(classWorkspaceRoute, /sameOrigin\(request\)/);
  assert.match(classWorkspaceRoute, /status: 403/);
  assert.match(classWorkspaceRoute, /ensureWorkspaceAccount\(user\.email\)/);
});

test("sınıf ve şube ekranı öğrenci kişisel verisini kalıcılaştırmaz", () => {
  assert.match(navigation, /\["classes", "Sınıf ve Şubeler"/);
  assert.match(client, /<ClassWorkspacesModule/);
  assert.match(classWorkspaceModule, /Öğrenci verisi saklanmaz/);
  assert.match(classWorkspaceModule, /Öğrenci listeleri, numaralar, puanlar ve gözlem notları oturum belleğinde kalır/);
  assert.doesNotMatch(classWorkspaceRepository, /student|name|score|number|note/i);
});

test("sınıf ekleme alanı gerçek şube değeriyle açılır ve yineleneni açıklar", () => {
  assert.match(classWorkspaceModule, /useState\("A"\)/);
  assert.match(
    classWorkspaceModule,
    /nextBranch\(payload\.workspaces, subjectCode, grade\)/,
  );
  assert.match(classWorkspaceModule, /placeholder="Şube kodu yazın"/);
  assert.match(classWorkspaceRepository, /çalışma alanı zaten var/);
  assert.match(classWorkspaceRepository, /çalışma alanı arşivde bulunuyor; yeniden etkinleştirin/);
});

test("öğrenci listeleri ilk sınıfı kalıcı çalışma alanında oluşturup hemen açar", () => {
  assert.match(client, /<ClassWorkspaceEmptyState onCreated=\{registerClassWorkspace\}/);
  assert.match(classWorkspaceEmptyState, /fetch\("\/api\/class-workspaces"/);
  assert.match(classWorkspaceEmptyState, /method: "POST"/);
  assert.match(classWorkspaceEmptyState, /Sınıfı oluştur ve aç/);
  assert.match(classWorkspaceEmptyState, /onCreated\(workspace\)/);
  assert.doesNotMatch(classWorkspaceEmptyState, /students|pastedRows|score/i);
});

test("sınıf kartları bağlı öğrenci işlemlerini açar", () => {
  assert.match(classWorkspaceModule, /Öğrenci listesini aç/);
  assert.match(classWorkspaceModule, /Sınav analizi/);
  assert.match(classWorkspaceModule, /Performans/);
  assert.match(classWorkspaceModule, /onOpenWorkspace\(item\.id, "rosters"\)/);
  assert.match(client, /setSelectedClassWorkspaceId\(workspace\.id\)/);
  assert.match(client, /setView\(target\)/);
});

test("etkin öğrenci oturumu sınıf arşivleme ve yıl geçişinde güvenlik kapısıdır", () => {
  assert.match(client, /hasSensitiveStudentSession/);
  assert.match(client, /onClearSensitiveSession=\{clearSensitiveStudentSession\}/);
  assert.match(classWorkspaceModule, /Oturumdaki öğrenci verilerinin silineceğini anlıyorum/);
  assert.match(classWorkspaceModule, /archiveConfirmedId !== item\.id/);
  assert.match(classWorkspaceModule, /onClearSensitiveSession\(\)/);
  assert.match(profileSettingsModule, /hasSensitiveSession/);
  assert.match(profileSettingsModule, /Etkin öğrenci oturumu varken öğretim yılı değiştirilemez/);
  assert.match(profileSettingsModule, /!hasSensitiveSession/);
});

test("etkin sınıf çalışma alanı öğrenci modüllerinin ortak bağlamıdır", () => {
  assert.match(client, /fetch\("\/api\/class-workspaces"\)/);
  assert.match(client, /filter\(\(item\) => !item\.archivedAt\)/);
  assert.match(client, /<ClassWorkspaceSelector/);
  assert.match(client, /classContext=\{selectedClassWorkspace!\}/);
  assert.match(rosterModule, /grade = classContext\.grade/);
  assert.match(analysisModule, /useState<Grade>\(classContext\.grade\)/);
  assert.match(performanceModule, /useState<Grade>\(classContext\.grade\)/);
});

test("sınıf bağlamı değişimi hassas oturum verisini açık onayla temizler", () => {
  assert.match(client, /Sınıf çalışma alanı değişirse bu oturumdaki öğrenci listeleri ve bekleyen aktarımlar silinir/);
  assert.match(client, /setSessionRosters\(\[\]\)/);
  assert.match(client, /setPendingRosterTransfer\(null\)/);
  assert.match(client, /setPendingRosterTarget\(null\)/);
  assert.doesNotMatch(client, /localStorage|sessionStorage/);
});
