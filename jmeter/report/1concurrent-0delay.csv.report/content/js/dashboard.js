/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 6;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9995544055157818, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9995047641686972, 500, 1500, "quarkus-vertx-resteasy-jvm"], "isController": false}, {"data": [0.9996256684491979, 500, 1500, "php-8.0-apache2"], "isController": false}, {"data": [0.9994496296466163, 500, 1500, "quarkus-vertx-resteasy-native"], "isController": false}, {"data": [0.9995905406534636, 500, 1500, "vertx-rxjava2"], "isController": false}, {"data": [0.9995546588141201, 500, 1500, "vertx-resteasy-rxjava2"], "isController": false}, {"data": [0.9994735918582207, 500, 1500, "webmvc"], "isController": false}, {"data": [0.9996567233189951, 500, 1500, "go"], "isController": false}, {"data": [0.9994656954682253, 500, 1500, "webflux"], "isController": false}, {"data": [0.9995964826739748, 500, 1500, "php-5.6-apache2"], "isController": false}, {"data": [0.9995259430016173, 500, 1500, "php-5.6-nginx"], "isController": false}, {"data": [0.9995491184806213, 500, 1500, "nodejs"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 604810, 0, 0.0, 3.1287892065275575, 0, 1065, 3.0, 4.0, 7.0, 3359.346360212844, 497.5574980611732, 461.44903480445794], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["quarkus-vertx-resteasy-jvm", 50481, 0, 0.0, 3.4193657019472656, 0, 1038, 4.0, 4.0, 8.0, 280.4577904941804, 24.923495053682046, 37.796069422067276], "isController": false}, {"data": ["php-8.0-apache2", 65450, 0, 0.0, 2.605729564553073, 0, 1036, 3.0, 3.0, 5.990000000001601, 363.6313128507139, 76.70348005444747, 52.20097948149897], "isController": false}, {"data": ["quarkus-vertx-resteasy-native", 43607, 0, 0.0, 3.9822505561034194, 0, 1035, 4.0, 5.0, 11.0, 242.2678407733548, 21.529661631225867, 32.64937697922164], "isController": false}, {"data": ["vertx-rxjava2", 59835, 0, 0.0, 2.8617865797609814, 0, 1033, 3.0, 4.0, 7.0, 332.42220703678396, 29.866057663461056, 44.79908649519158], "isController": false}, {"data": ["vertx-resteasy-rxjava2", 55014, 0, 0.0, 3.127549351074251, 0, 1044, 3.0, 4.0, 7.0, 305.64861576412153, 32.53486242020434, 41.19092673383669], "isController": false}, {"data": ["webmvc", 45592, 0, 0.0, 3.801280926478311, 0, 1065, 4.0, 5.0, 8.0, 253.29029605720032, 43.03956202534459, 34.13482505458364], "isController": false}, {"data": ["go", 71371, 0, 0.0, 2.375698813243478, 0, 1042, 3.0, 3.0, 6.0, 396.50555555555553, 49.95040690104167, 53.43531901041667], "isController": false}, {"data": ["webflux", 45854, 0, 0.0, 3.7855585117983193, 0, 1038, 4.0, 5.0, 8.0, 254.74444444444444, 22.638422309027778, 34.33079427083333], "isController": false}, {"data": ["php-5.6-apache2", 59477, 0, 0.0, 2.881903929249975, 0, 1052, 3.0, 4.0, 6.0, 330.45898779329156, 69.70619273764744, 47.438936724232285], "isController": false}, {"data": ["php-5.6-nginx", 53791, 0, 0.0, 3.1994943392017308, 0, 1046, 3.0, 4.0, 7.0, 298.8671152275493, 56.037584105165486, 42.90377533051733], "isController": false}, {"data": ["nodejs", 54338, 0, 0.0, 3.1701387610880194, 0, 1047, 3.0, 4.0, 6.0, 301.91635597881947, 70.76164593253583, 40.687946411208095], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 604810, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
