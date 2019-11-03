const { getClaps, createConnection } = require('./modules/mongodb')

exports.handler = async (event) => {
    // add post check
    const pageId = event.queryStringParameters.pageId
    const userId = event.queryStringParameters.userId

    const { collection: dbCollection, connection } = await createConnection()
    const result = await getClaps(dbCollection, pageId)
    connection.close()
    return {
        statusCode: 200,
        body: JSON.stringify({
            count: result.length || 0,
            isClicked: result.some(item => item.userId === userId)
        })
    }
}
