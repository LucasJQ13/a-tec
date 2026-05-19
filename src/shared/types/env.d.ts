declare namespace NodeJS {
  type ProcessEnv = {
    EXPO_PUBLIC_SUPABASE_URL?: string;
    EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string;
    EXPO_PUBLIC_CONTACTS_CREATED_BY?: string;
  };
}

declare const process: {
  env: NodeJS.ProcessEnv;
};
