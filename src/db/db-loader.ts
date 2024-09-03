 export async function loadDatabaseModule() { 
  let modulePath = './db.module';  
  try { 
      const module = await import(modulePath);
      return module.DBModule;
  } catch (error) {
    console.error(`Failed to load the database module from ${modulePath}:`, error);
    throw error;
  }
}
