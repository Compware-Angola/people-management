export enum PermissionsEnum {
  READ_AUDIT_LOG = 'read.audit_log',

  // --- DEPARTMENTS ---
  CREATE_DEPARTMENT = 'create.department',
  READ_DEPARTMENT = 'read.department',
  UPDATE_DEPARTMENT = 'update.department',
  DELETE_DEPARTMENT = 'delete.department',
  MANAGE_DEPARTMENT_PERMISSIONS = 'manage.department_permissions',
  MANAGE_DEPARTMENT_STATUS = 'manage.department_status',

  // --- ADMIN ---
  CREATE_ADMIN = 'create.admin',
  READ_ADMIN = 'read.admin',
  UPDATE_ADMIN = 'update.admin',
  DELETE_ADMIN = 'delete.admin',
  MANAGE_ADMIN_STATUS = 'manage.admin_status',
  MANAGE_ADMIN_PERMISSIONS = 'manage.admin_permissions',

  // --- PERMISSIONS ---

  READ_PERMISSIONS = 'read.permissions',
  UPDATE_PERMISSIONS = 'update.permissions',
  FULL_ACCESS = 'full_access'
}
