const util = require( "util" )
const Handlebars = require( "handlebars" )
const express = require('express')
const exphbs = require( "express-handlebars" )
const hbs = exphbs.create()
const fs = require( "fs" )
const app = express()
const path = require( "path" )

var head = Handlebars.registerPartial( "header", "<h1> TEST H1 </h1>" )

// define default view handler
app.set( "view engine", "handlebars" )
app.set( "view cache", undefined )
app.set( "views", "./web/views/" )
// app.engine( "handlebars", require( "handlebars" ).compile )
app.engine('handlebars', exphbs( { layoutsDir: "./web/views/layouts",partialsDir: "./web/views/partials", defaultLayout: 'main' } ))


// allways call !
app.use( function( req, res, next ){
	console.log( "DO SOME PRE ROUTE JOB : Auth, DB Connect ..." )
	next()
})
app.get( "/", function ( req, res ) {
	console.log( "GETTING INDEX BODY" )
	res.render( "index" )
})
// CSSs
app.get( "/*.css*", function ( req, res ) {
	fs.readFile( "./web/css/" + path.basename( req.path ), ( err, data ) => {
		if ( err ) console.log( "ERROR : GETTING CSS" )
		
		console.log( "GETTING CSS" )
		res.type( "text/css" )
		res.send( data )
	})
})
// IMAGES
app.get( "/*.(ico|png)*", function ( req, res ) {
	fs.readFile( "./web/images/" + path.basename( req.path ), ( err, data ) => {
		if ( err ) console.log( "ERROR : GETTING IMAGE" + util.inspect( err, { showHidden: true, depth: null } ))

		console.log( "GETTING IMAGE" )

		var ext = path.extname( req.path )
		if(  ext === "ico" ) {
			var subtype = "x-icon"
		} else {
			var subtype = ext
		}
		res.type( "image/" + subtype )
		res.send( data )
	})
})

app.get('/connect', function (req, res) {
	var data = {
		handlebar_text: "WELCOME TO THE TEMPLATE WORLD" 
	}

	var modele = "some <b< bold </b> text. <br /> A new Line <br /> and a heading <h2> BOUM BIG TITLE TEXT </h2><br /> +handlebar : {{ handlebar_text }}"


	var s = "OBJECT START"

	for( var p in req ){
		s += p + " \r\n"
	}
})
app.get('/about', function (req, res) {
	  res.send('ABOUTT')
})
app.use( function ( req, res, next ){
	res.status( 404 ).send( "SORRY, 4 THIS IS A BLANK PAGE" )
})



app.listen(3000, function () {
	  console.log('Example app listening on port 3000!')
})
