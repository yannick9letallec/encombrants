const fs = require( "fs" )
const path = require( "path" )
const util = require( "util" )
const Handlebars = require( "handlebars" )
const delimiters = require( "handlebars-delimiters" )
const express = require('express')
const exphbs = require( "express-handlebars" )
const hbs = exphbs.create()
const app = express()
const Coords = require( "random-coordinates" )
const bodyParser = require('body-parser');


// change handlebars delimiter
delimiters( Handlebars, [ "<%", "%>" ] )
let coords

// define default view handler
app.set( "views", "./web/views/" )
app.set( "view cache", undefined )
// app.engine( "handlebars", require( "handlebars" ).compile )
app.engine( 'handlebars', exphbs( { layoutsDir: "./web/views/layouts", partialsDir: "./web/views/partials", defaultLayout: 'main', helpers: {
	 toJSON : function( object ) {
		 console.log( "HDB HELPER JSON " + JSON.stringify( object ))
		  return JSON.stringify(object);
	  }
	}
} ) )
app.set( "view engine", "handlebars" )

// allways call !
app.use( function( req, res, next ) {
	bodyParser.urlencoded( { extended: true } )
	next()
})

app.use( function( req, res, next ){
	console.log( "DO SOME PRE ROUTE JOB : Auth, DB Connect ..." )
	
	// random geo data
	let pre_coords = Coords().split( "," )
	coords = {
		lat: pre_coords[ 0 ],
		lng: pre_coords[ 1 ]
	}
	console.log( coords )
	next()
})
app.get( "/", function ( req, res ) {
	console.log( "GETTING INDEX BODY" )
	res.render( "index", { coords: coords } )
})
app.get( "/legal", function ( req, res ) {
	console.log( "GETTING LEGAL PAGE" )
	res.render( "legal" )
})

app.post( "/legal_city_choice", function( req, res ){
	console.log( "Receive From FORM !!!!!!!!!!!!!!!" )
	console.log( req.get( "Content-Type" ))
	console.log( req.body )
})

// JS
app.get( "/*vue*", function ( req, res ) {
	fs.readFile( "./node_modules/vue/dist/vue.min.js", ( err, data ) => {
		if ( err ) console.log( "ERROR : GETTING VUE JS" )
		
		console.log( "GETTING VUE JS" )
		res.type( "application/javascript" )
		res.send( data )
	})
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
	console.log( "GETTING IMAGE " + req.path )
	fs.readFile( req.path, ( err, data ) => {
		if ( err ) console.log( "ERROR : GETTING IMAGE" + util.inspect( err, { showHidden: true, depth: null } ))

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

app.get('/legal_get-cities', function (req, res) {
	  res.render('legal_get-cities', { layout: false } )
})

app.use( function ( req, res, next ){
	res.status( 404 ).send( "SORRY, 4 THIS IS A BLANK PAGE" )
})



app.listen(3000, function () {
	  console.log('Example app listening on port 3000!')
})
