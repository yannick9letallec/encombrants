const fs = require( "fs" )
const exec = require('child_process').exec;
const util = require( "util" )
const { URL } = require( "url" )
const cheerio = require('cheerio');

/*
 * ALGO SUMMARY
 * 1 - prepare wget command 
 * 2 - execute it
 * 3 - extract link from google results | TO IMPROVE !
 * 4 - execute wget to get appropriate encombrant page
 * 5 - send it via express response
 * */

module.exports = {
	res: {},
	
	userAgent: "\"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.43 Safari/537.31\"",
	
	basePath: "./web/temp_files/",
	
	wgetBase: function( ) {
		
		return "wget -U " + this.userAgent

	},

	createGoogleRequest: function( searchToken, res ){
		this.res = res

		var filtered = searchToken.city.replace( / /g, "+" ) + "+" + searchToken.token
		var outFile = filtered + ".html"

		var cmd = this.wgetBase() + " " + "https://google.fr/search?q=" + filtered +  " -O " + this.basePath + outFile

		console.log( "------------------ " + cmd ) 
		console.dir( this.userAgent ) 
		
		this.callWGET( cmd, outFile, filtered, "OK : Get Google results for : ", this.filterFirstElementFromResults )
	},
	
	filterFirstElementFromResults: function( file, scope ){
		console.log( "OPENNING FILE : " + file ) 
		fs.readFile( "./web/temp_files/" + file, function ( err, data ) {
			if( err ) console.log( "ERR : Reading File : " + util.inspect( err, { depth: null, showHidden: true } ) ) 

			var outFile = "displayableResult.html"
			var $ = cheerio.load( data )
			console.log( "/////// " + $( "head" ) ) 
			var el = $( ".g a" )
			var link = el.attr( "href" )

			// check for base element presence
			var base = $( "base" )
			if( base.length === 0 ) {
				var baseUrl = scope.extractBaseUrl( link )
				$( "<base href='" + baseUrl + "' target='_self' />" ).appendTo( "head" )
			}
		
			var cmd = scope.wgetBase() + " " + link + " -O " + scope.basePath + outFile
			scope.res.send( link )
			console.log( "##------------------" + link + " " + base.length ) 

			// scope.callWGET( cmd, outFile, {}, "OK : Get Final Legal Results !! : ", scope.displayLegalPage )
		})
	},
	
	extractBaseUrl: function( link ){
		var url = new URL( link )
		console.log( "URL ::::::: " + url.origin ) 
		return url.origin 
	},

	callWGET: function( cmd, outFile, token, msg, cb ){
		console.log( "------------------ " + cmd ) 
		var dir = exec( cmd, ( err, stdout, stderr ) => {
			if( err ) console.log( "------------------" + util.inspect( err, { showHidden: true, depth: null  } )) 

			console.log( stdout ) 
		})
		dir.on( "exit", ( code ) => {
			if( code === 0) {
				console.log( msg + token + ",Code : " + code ) 
				// this.filterFirstElementFromResults( outFile )
				cb( outFile, this )
			}
		})
	},

	displayLegalPage: function( file, scope ){
		console.log( "FINAL RESULT " + file ) 

		fs.readFile( scope.basePath + file, "utf-8", function( err, data ){
			if( err ) console.log( "------------------" + util.inspect( err, { showHidden: true, depth: null  } )) 

			// console.log( "DATA : " + JSON.stringify( data ))
			scope.res.send( data )
			// return data
		})
	}
}
