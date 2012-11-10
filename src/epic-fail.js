'use strict';

var _clients = {},
	_docs = {};

exports.add = function add( socket ) {
	var clientId = socket.id,
		client = _clients[ clientId ] = {
			docId: null,
			doc: null
		};

	socket.on( 'init', function( data ) {
		var docId = data.docId;
		client.docId = docId;
		var doc = _docs[ docId ];

		if ( !doc ) {
			_docs[ docId ] = doc = { id: docId, clients: [], content: data.content };
		}
		else {
			socket.emit( 'init', { content: doc.content } );
		}
		doc.clients.push( client );
		client.doc = doc;

		console.log( '[EPIC] Client (' + clientId + ') conntected to edit doc:' + docId );
		console.log( '[EPIC] Number of clients editing doc:' + docId + ': ' + doc.clients.length );
	});

	socket.on( 'disconnect', function() {
		delete _clients[ clientId ];

		var docClients = client.doc.clients;
		docClients.splice( docClients.indexOf( clientId ), 1 );

		if ( !docClients.lenth ) {
			delete _docs[ client.docId ];
		}
		console.log( '[EPIC] Client (' + clientId + ') disconntected from doc:' + client.docId );
		console.log( '[EPIC] Number of clients editing doc:' + client.docId + ': ' + docClients.length );
	});
};