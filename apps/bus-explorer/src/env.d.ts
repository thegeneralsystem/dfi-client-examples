interface ImportMetaEnv {
  readonly VITE_DFI_API_TOKEN: string;
  readonly VITE_MAPBOX_API_TOKEN: string;
  readonly VITE_DFI_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
