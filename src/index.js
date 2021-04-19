import 'ol/ol.css';
import {Map, View} from 'ol';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
//import MVT from 'ol/format/MVT';
import GeoJSON from 'ol/format/GeoJSON';
import {OSM , XYZ, Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
//import {transform} from 'ol/proj';
import {bbox} from 'ol/loadingstrategy';
import BingMaps from 'ol/source/BingMaps';
import {Circle as CircleStyle, Fill, Stroke, Style, Text} from 'ol/style';
import {transform} from 'ol/proj';


// const GeoJSONSource = new VectorSource({
//     url : "./manbou.geojson",
//     format : new GeoJSON({
//         dataProjection: 'EPSG:4326',
//         featureProjection: 'EPSG:3857'
//     })
// })

var GeoJSONSource = new VectorSource({
    format: new GeoJSON(),
    loader: function(extent) {
       var url = './manbou.geojson';
       var xhr = new XMLHttpRequest();
       xhr.open('GET', url);
       var onError = function() {
        GeoJSONSource.removeLoadedExtent(extent);
       }
       xhr.onerror = onError;
       xhr.onload = function() {
         if (xhr.status == 200) {
            GeoJSONSource.addFeatures(
                GeoJSONSource.getFormat().readFeatures(xhr.responseText,{
                    'dataProjection' : 'EPSG:4326',
                    'featureProjection' : 'EPSG:3857'
                }));
         } else {
           onError();
         }
       }
       xhr.send();
     },
     strategy: bbox
   });

const getText = function(feature) {
    //console.log(feature.get('N03_004'));
    return feature.get('N03_004');
}

const map = new Map({
  target: 'map',
  layers: [
    // new VectorTileLayer({
    //     //declutter: true,
    //     source: new VectorTileSource({
    //       maxZoom: 10,
    //       format: new MVT(),
    //       url:
    //         'http://sfc.makeapps.xyz/mvt/{z}/{x}/{y}.pbf',
    //     })
    // }),
    // new TileLayer({
    //     source: new OSM()
    // }),
    new TileLayer({
        visible: true,
        preload: Infinity,
        source: new BingMaps({
            culture : 'ja-JP',
            key: '',
          imagerySet: 'RoadOnDemand',
          // use maxZoom 19 to see stretched tiles instead of the BingMaps
          // "no photos at this zoom level" tiles
          // maxZoom: 19
        })
    }),
   new VectorLayer({
       source : GeoJSONSource,
       style : function (feature) { 
        return new Style({
            stroke: new Stroke({
              color: 'red',
              width: 2,
            }),
            fill: new Fill({
              color: 'rgba(255, 0, 0, 0.3)',
            }),
            text : new Text({
                stroke : new Stroke({
                    color: 'black',
                    width: 2,
                }),
                fill : new Fill({
                    color: 'rgba(255, 255, 255, 1)'
                }),
                text : getText(feature),
                font: '14px "Open Sans", "Arial Unicode MS", "sans-serif"',
            })
          })
        }
      })
  ],
  view: new View({
    center: transform([130, 35],'EPSG:4326','EPSG:3857'),
    zoom: 5,
    projection :  'EPSG:3857'
  })
});