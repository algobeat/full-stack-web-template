export function encodeGlobalId(type: string, id: string) {
  return Buffer.from(`${type}_${id}`, 'binary').toString('base64');
}

export function decodeGlobalId(globalId: string) {
  const decoded = Buffer.from(globalId, 'base64').toString('binary');
  const [type, id] = decoded.split('_');
  return {type, id};
}