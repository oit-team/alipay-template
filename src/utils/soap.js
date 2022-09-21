import xml from 'xml'

export function soapXML(data) {
  const { method, body = [] } = data
  return xml({
    'soap:Envelope': [
      {
        _attr: {
          'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/',
          'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
          'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
        },
      },
      {
        'soap:Body': [
          {
            [method]: [
              { _attr: { xmlns: 'http://tempuri.org/' } },
              ...body,
            ],
          },
        ],
      },
    ],
  }, {
    declaration: {
      standalone: 'yes',
      encoding: 'utf-8',
    },
  })
}

/**
 * 转换对象为xml支持的格式
 * @param {object} data 要转换的对象
 * @returns {array} 转换后的数组
 * @example
 * transformObject({ a: 1, b: 2 })
 * // => [{ a: 1 }, { b: 2 }]
 */
export function transformObject(data) {
  return Object
    .entries(data)
    .map(([key, value]) => ({ [key]: value }))
}
