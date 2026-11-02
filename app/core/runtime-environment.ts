import { AsyncLocalStorage } from "node:async_hooks";

/**
 * Worker ortamı bağlamı.
 *
 * D1 için kullanılan `db/runtime-env.ts` deseniyle aynıdır: istek işleyicisi
 * boyunca ortam değerleri AsyncLocalStorage üzerinden taşınır, böylece rota
 * veya bileşen kodları ortamı parametre olarak almak zorunda kalmaz.
 *
 * Sites dağıtımında bu değerler boştur; kimlik Sites başlıklarından gelir.
 * Workers dağıtımında `FOPOS_*` değişkenleri Worker secret/vars olarak
 * tanımlanır ve kendi oturum yönetimi devreye girer.
 */
export type FoposRuntimeEnvironment = {
  FOPOS_ACCESS_CODE?: string;
  FOPOS_SESSION_SECRET?: string;
  FOPOS_TEACHER_EMAIL?: string;
  FOPOS_TEACHER_NAME?: string;
};

const environmentContext = new AsyncLocalStorage<FoposRuntimeEnvironment>();

export function runWithEnvironment<T>(
  environment: FoposRuntimeEnvironment,
  operation: () => T,
): T {
  return environmentContext.run(environment, operation);
}

export function getRuntimeEnvironment(): FoposRuntimeEnvironment | null {
  return environmentContext.getStore() ?? null;
}

/**
 * Kimlik kendi sunucusunun üzerinde etkinleşebilir mi?
 *
 * Gereken üç değer de tanımlı olmalıdır: geçiş kodu, oturum imzalama
 * anahtarı ve öğretmen e-postası. Eksik herhangi biri varsa uygulama
 * her zaman "kimliksiz" davranır — yarım yapılandırılmış bir oturum
 * üretmektense kimliksiz kalmak güvenlidir.
 */
export function selfHostedIdentityConfigured(
  environment: FoposRuntimeEnvironment | null,
): boolean {
  if (!environment) return false;
  return Boolean(
    environment.FOPOS_ACCESS_CODE?.trim() &&
      environment.FOPOS_SESSION_SECRET?.trim() &&
      environment.FOPOS_TEACHER_EMAIL?.trim(),
  );
}
