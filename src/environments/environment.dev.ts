export const environment = {
  production: true,
  sitePath: (window as { [key: string]: any })['env']['sitePath'] || '',
  karmYogiPath: (window as { [key: string]: any })['env']['karmYogiPath'] || '',
  portalRoles: (((window as { [key: string]: any })['env']['portalRoles'] || '').split(',')) || [],
  name: (window as { [key: string]: any })['env']['name'],
  cbpProviderRoles: (window as { [key: string]: any })['env']['cbpProvidersRoles'] || [],
  userBucket: (window as { [key: string]: any })['env']['userBucket'] || '',
  departments: (window as { [key: string]: any })['env']['departments'] || [],
  contentHost: (window as { [key: string]: any })['env']['contentHost'] || '',
  contentBucket: (window as { [key: string]: any })['env']['azureBucket'] || '',
  spvPath: (window as { [key: string]: any })['env']['spvPath'] || '',
  connectionType: (window as { [key: string]: any })['env']['connectionType'] || '',
  KCMframeworkName: (window as { [key: string]: any })['env']['KCMframeworkName'] || '',
  compentencyVersionKey: (window as { [key: string]: any })['env']['compentencyVersionKey'] || '',
  ODCSMasterFramework: (window as { [key: string]: any })['env']['ODCSMasterFramework'] || '',
}
