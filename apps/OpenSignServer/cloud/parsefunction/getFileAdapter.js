export default async function getFileAdapter(request) {
  if (!request?.user) {
    throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'User is not authenticated.');
  }
  try {
    const extUserCls = new Parse.Query('contracts_Users');
    extUserCls.equalTo('UserId', request.user);
    extUserCls.include('TenantId');
    const extUser = await extUserCls.first({ useMasterKey: true });
    if (extUser) {
      const _extUser = JSON.parse(JSON.stringify(extUser));
      if (_extUser?.TenantId?.ActiveFileAdapter && _extUser?.TenantId?.FileAdapter?.bucketName) {
        const adapterConfig = {
          bucketName: _extUser?.TenantId?.FileAdapter?.bucketName,
          region: _extUser?.TenantId?.FileAdapter?.region,
          endpoint: _extUser?.TenantId?.FileAdapter?.endpoint,
          baseUrl: _extUser?.TenantId?.FileAdapter?.baseUrl,
          accessKeyId: _extUser?.TenantId?.FileAdapter?.accessKeyId,
          secretAccessKey: _extUser?.TenantId?.FileAdapter?.secretAccessKey,
          fileAdapter: _extUser?.TenantId?.ActiveFileAdapter,
        };
        return adapterConfig;
      } else {
        return {};
      }
    } else {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'User not found.');
    }
  } catch (err) {
    console.log('Err in add custom file adapter', err);
    const code = err.code || 400;
    const msg = err.message || 'Something went wrong.';
    throw new Parse.Error(code, msg);
  }
}