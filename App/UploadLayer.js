	Ext.define('MyPath.UploadLayer',{
	extend: 'Ext.window.Window',	
	width:310,	
	height:160,	
	alias: 'widget.UploadLayer',			
	mapContainer:'',			
	title:'Please select file to upload',	
	initComponent:function(){		
		this.items = this.buildItems();				
		//this.buttons = this.buildButtons()
		this.callParent();		
	},	
	buildItems:function(){		
		return[			
			Ext.create('Ext.form.Panel',{
			itemId:'fpanel',
			bodyPadding: 20,				
			width:300,
			height:120,
			
			items:[{
					xtype:'filefield',
					name:'upload',							
					width:250,					
					//height:300,
					allowBlank: false,
					listeners: {
						change: function(fld, value) {
							  var newValue = value.replace(/C:\\fakepath\\/g, '');
							  fld.setRawValue(newValue);							 
						}
					}					
				},			
				{
						xtype: 'label',
						text: 'Feature color:',
						margin: '0 0 0 10'
				},
				{	
					xtype:'button',
					itemId:'btnColor',	
					name:'#000000',
					//text:'Feature color',
					style: 'position:absolute; left:160px; top:50px;',						
					menu: {
						xtype: 'colormenu',
						value: '000000',
						itemId:'cmenu',
						handler: function (obj, rgb) {										
							var color='#'+ rgb.toString()										
							this.up().up().btnInnerEl.setStyle({background:color});		
							this.up().up().name=color;	
							
						} // handler
					}, // menu
				},
			],
			buttons:[
					{
					xtype:'button',				
					itemId:'upBtn',
					text:'Upload',						
					width:'110px',	
					style: 'position:absolute; left:160px; top:85px;',						
					handler:function(){		
						
						var me = this.up().up();				
						var file = me.down().value //get filename
						//var color= me.down().down().value
						
						var form=me;
						var me = this.up('form').up('panel');					
						var ref = this
						if(form.isValid()){									
							form.submit({									
								//url:'/upload',							
								url:'/webapi/get.ashx?url=http://ogre.adc4gis.com/convert',
								method:'POST',
								waitMsg:'Uploading data, please wait...',		
								//header: 'multipart/form-data',								
								success: function(response, opts) {									
								  console.log(Ext.decode(response.responseText));
								},  
								failure:function(response, opts){	
									console.log(Ext.decode(opts.response.responseText));									
									jsonfile=Ext.decode(opts.response.responseText);
									
									var geojson_format = new OpenLayers.Format.GeoJSON({
										'internalProjection': new OpenLayers.Projection("EPSG:900913"),//me.mapContainer.map.projection,
										'externalProjection': new OpenLayers.Projection("EPSG:4326")
									});
									
									var featureColor = ref.up().up().getComponent('btnColor').name;
									
									
									var vectorStyle = new OpenLayers.StyleMap({'default':{
													strokeWidth: 2,
													strokeColor:featureColor,	
													fillColor:featureColor,		
													pointRadius:6
									}});
											
									var vectorLayer = new OpenLayers.Layer.Vector(file, {												
											projection: new OpenLayers.Projection("EPSG:4326"),											
											styleMap: vectorStyle,
											renderers: ["Canvas"]		
									})		
									vectorLayer.addFeatures(geojson_format.read(jsonfile));
									//me.mapContainer.layers[2].addFeatures(geojson_format.read(jsonfile));
									
									me.mapContainer.addLayer(vectorLayer);	
									
									me.close();	
									
								},
								callback:function(response, opts){
									console.log(Ext.decode(response.responseText));
								
								}	
							});
						} 
						
					}				
				}]	
			})
		];
		
	}	
});




