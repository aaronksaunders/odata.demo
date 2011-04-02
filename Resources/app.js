// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// create tab group
var tabGroup = Titanium.UI.createTabGroup();

//
// create base UI tab and root window
//
var win1 = Titanium.UI.createWindow({
	title:'ODATA Netfix Demo',
	backgroundColor:'#fff',
	tabBarHidden:true
});
var tab1 = Titanium.UI.createTab({
	window:win1
});

var tableView = Titanium.UI.createTableView({
	top:0,
	height:'100%',
	width:'100%'
});

win1.add(tableView);
//  add tabs
//
tabGroup.addTab(tab1);

// open tab group
tabGroup.open();

getTableData(tableView);

function getTableData(_tableView) {
	// get the login information and let it roll!!
	try {
		var xhr = Titanium.Network.createHTTPClient();

		// with images http://geocommons.com/overlays/104992
		xhr.open("GET", "http://odata.netflix.com/v1/Catalog/Titles?$top=20");

		// set Content-Type
		xhr.setRequestHeader('accept', "application/json");

		xhr.onerror = function(e) {
			Ti.API.error("ERROR " + e.error);
		};
		xhr.onload = function() {
			var json_data = JSON.parse(xhr.responseText).d;
			var data = [];

			Ti.API.info("Success " + json_data.length);

			for (var i=0; i < json_data.length; i++) {
				var aRow = Titanium.UI.createTableViewRow({
					height: "auto",
					width:'100%',
					className: "datarow"
				} );

				var image = Titanium.UI.createImageView({
					image: json_data[i].BoxArt.LargeUrl,
					top: 5,
					bottom: 5,
					left: 5,
					width:80,
					height:80
				} );

				aRow.add( image );

				var name = Titanium.UI.createLabel({
					text: json_data[i].Name + " (" + json_data[i].ReleaseYear + ")",
					font: {
						fontSize: 16,
						fontWeight: "bold"
					},
					textAlign: "left",
					left: 90,
					top: 2,
					right: 5,
					height: 'auto'
				} );

				aRow.add( name );

				data.push(aRow);

				Ti.API.debug(json_data[i].BoxArt);
			};
			_tableView.setData(data);
		};
		xhr.onreadystatechange = function (aEvt) {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					Titanium.API.debug("status 200 ");
				}
			}
		};
		xhr.send({});
	} catch(err) {
		Titanium.UI.createAlertDialog({
			title: "Error",
			message: String(err),
			buttonNames: ['OK']
		}).show();
	}

};