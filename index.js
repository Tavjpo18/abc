const express = require('express')
const path = require('path')
const hbs = require('hbs')
const { tableName, docClient, dynamoDB } = require('./crudaws')
const app = express()
const port = process.env.PORT || 3000
const publicPath = path.join(__dirname, './public')


app.use(express.static(publicPath))
app.use(express.json())


app.get('', function (req, res) {
    res.sendFile(publicPath + '/html/index.html', {})
})

app.get('/sinhvien', function (req, res) {
    const scanTable = async (tableName) => {
        const params = {
            TableName: tableName,
        };

        const scanResults = [];
        let items;
        do {
            items = await docClient.scan(params).promise();
            items.Items.forEach((item) => scanResults.push(item));
            params.ExclusiveStartKey = items.LastEvaluatedKey;
        } while (typeof items.LastEvaluatedKey != "undefined");

        return scanResults;
    }

    scanTable(tableName).then((result) => {
        res.status(200).send(result)
    }).catch(e => {
        res.status(404).send({ 'Sinhvienv1': [] })
    })
})


app.post('/sinhvien', (req, resp) => {

    const params = {
        TableName: tableName,
        Item: {
            ...req.body
        }
    }
    docClient.put(params, (err, data) => {
        if (err) {
            return resp.status(500).send(JSON.stringify(err, null, 3))
        } else {
            return resp.status(201).send({ ...req.body })
        }
    })
})

app.delete('/sinhvien/:id', async (req, resp) => {
    const id = req.params.id

    const userId = await dynamoDB.getItem({
        TableName: tableName,
        Key: {
            'mssv': { 'S': id }
        }
    }).promise()

    dynamoDB.deleteItem({
        "TableName": tableName,
        "Key": {
            "mssv": { 'S': id }
        }
    }, (e, d) => {
        if (e) {
            resp.status(500).send({ 'error': 'can not delete' })
        } else {
            resp.status(200).send({ ...userId.Item })
        }
    })

})

app.patch('/sinhvien/:id', (req, resp) => {
    console.log(req.params.id)
    const params = {
        TableName: tableName,
        Key: {
            "mssv": req.params.id
        },
        UpdateExpression: "SET hoten = :hoten,namsinh = :namsinh,email = :email",
        ExpressionAttributeValues: {
            ":hoten": req.body.hoten,
            ':namsinh': req.body.namsinh,
            ':email': req.body.email
         
        },
        ReturnValues: "UPDATED_NEW"
    }

    docClient.update(params, (err, data) => {
        if (err) {
            resp.status(500).send({ 'error': 'can not update' })
        } else {
            resp.status(200).send({ 'mssv': req.params.id, 'hoten': req.body.hoten,'namsinh': req.body.namsinh, 'email': req.body.email })
        }
    })
})

app.listen(port, () => {
    console.log(`listen host ${port}`)
})