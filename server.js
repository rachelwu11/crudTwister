console.log('May Node be with you')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb://test1:a12345@ds117859.mlab.com:17859/star-wars-quotes', (err, database) => {
	if (err) return console.log(err)
	db = database
	app.listen(3000, () => {
 		console.log('listening on 3000')
	})
})

app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.json())

// app.get('/', (req, res) => {
//  res.sendFile(__dirname + '/index.html')
//  console.log(__dirname)
// })
app.post('/quotes', (req, res) => {
	db.collection('quotes').save(req.body, (err, result) => {
		if (err) return console.log(err)

		console.log('saved to database')
		res.redirect('/')
	})
	console.log(req.body)
})

app.get('/', (req, res) => {
	db.collection('quotes').find().toArray(function(err, results) {
		if (err) return console.log(err)
		//renders index.ejs
		res.render('index.ejs', {quotes: results})
	console.log(results)
	})
})

app.put('/quotes', (req, res) => {
	db.collection('quotes').findOneAndUpdate(
		{name: 'Yoda'}, 
		{$set: {
			name: req.body.name,
			quote: req.body.quote
		}},
		{sort: {_id: -1},
		upsert: true
		}, (err, result) => {
			if (err) return res.send(err)
			res.send(result)
		})
})

