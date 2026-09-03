"use client";

import { Component, type ErrorInfo, type ReactNode, Suspense } from "react";

type Props = {
  children: ReactNode;
  moduleName: string;
};

type State = { failed: boolean };

class ModuleLoadErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`FOPOS ${this.props.moduleName} modülü yüklenemedi.`, error, info);
  }

  render() {
    if (this.state.failed) {
      return (
        <section className="async-module-state" role="alert">
          <h2>{this.props.moduleName} açılamadı</h2>
          <p>
            Modül dosyası yüklenirken geçici bir sorun oluştu. Bağlantınızı
            denetleyip yeniden deneyin.
          </p>
          <button
            className="primary-button"
            type="button"
            onClick={() => window.location.reload()}
          >
            Yeniden dene
          </button>
        </section>
      );
    }

    return this.props.children;
  }
}

function ModuleLoadingState({ moduleName }: { moduleName: string }) {
  return (
    <section
      className="async-module-state async-module-loading"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="async-module-spinner" aria-hidden="true" />
      <div>
        <h2>{moduleName} yükleniyor</h2>
        <p>Modül güvenli biçimde hazırlanıyor…</p>
      </div>
    </section>
  );
}

export function AsyncModuleBoundary({ children, moduleName }: Props) {
  return (
    <ModuleLoadErrorBoundary moduleName={moduleName}>
      <Suspense fallback={<ModuleLoadingState moduleName={moduleName} />}>
        {children}
      </Suspense>
    </ModuleLoadErrorBoundary>
  );
}
