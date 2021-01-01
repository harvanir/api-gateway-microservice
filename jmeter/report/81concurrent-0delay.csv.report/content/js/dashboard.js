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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9827597378238837, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9852518846476008, 500, 1500, "quarkus-vertx-resteasy-jvm"], "isController": false}, {"data": [0.9883239404787075, 500, 1500, "php-8.0-apache2"], "isController": false}, {"data": [0.8881556642611518, 500, 1500, "quarkus-vertx-resteasy-native"], "isController": false}, {"data": [0.9883173666035424, 500, 1500, "vertx-rxjava2"], "isController": false}, {"data": [0.9864812071687855, 500, 1500, "vertx-resteasy-rxjava2"], "isController": false}, {"data": [0.9820714611063313, 500, 1500, "webmvc"], "isController": false}, {"data": [0.9885644265185106, 500, 1500, "go"], "isController": false}, {"data": [0.9839951767674209, 500, 1500, "webflux"], "isController": false}, {"data": [0.9868490419941021, 500, 1500, "php-5.6-apache2"], "isController": false}, {"data": [0.9838478795000534, 500, 1500, "php-5.6-nginx"], "isController": false}, {"data": [0.9839669130587821, 500, 1500, "nodejs"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1172952, 0, 0.0, 128.72509019976334, 0, 7426, 262.90000000000146, 398.0, 1065.0, 6480.8274581740225, 948.6674951775118, 890.4946445430775], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["quarkus-vertx-resteasy-jvm", 100284, 0, 0.0, 136.81069761876455, 0, 2266, 331.0, 485.9500000000007, 792.0, 555.9072490119016, 49.40191373054984, 74.91718785511955], "isController": false}, {"data": ["php-8.0-apache2", 137161, 0, 0.0, 99.52320995035078, 0, 3268, 195.0, 382.0, 984.9900000000016, 761.9293626192937, 160.71947492750724, 109.37853154788688], "isController": false}, {"data": ["quarkus-vertx-resteasy-native", 41294, 0, 0.0, 335.4532861917008, 1, 5798, 713.0, 912.9000000000015, 1425.9800000000032, 229.38434960365737, 20.38474200579377, 30.913125239555388], "isController": false}, {"data": ["vertx-rxjava2", 143632, 0, 0.0, 95.28817394452575, 0, 3087, 198.0, 410.9500000000007, 611.9900000000016, 796.8488210818307, 71.59188626907074, 107.3878294036061], "isController": false}, {"data": ["vertx-resteasy-rxjava2", 122866, 0, 0.0, 111.48303843211357, 0, 3316, 280.0, 441.9500000000007, 685.9900000000016, 682.4334457151426, 72.64184138960015, 91.96856983270477], "isController": false}, {"data": ["webmvc", 79036, 0, 0.0, 174.14145452704685, 0, 3408, 356.0, 480.9500000000007, 1036.9700000000048, 437.9769141679181, 74.42185846212672, 59.02423257341084], "isController": false}, {"data": ["go", 149752, 0, 0.0, 91.82175864095316, 0, 2270, 208.0, 386.0, 651.9900000000016, 830.0372472507981, 104.56523915561813, 111.86048839903334], "isController": false}, {"data": ["webflux", 98689, 0, 0.0, 139.18697119233158, 0, 7345, 303.0, 417.0, 643.9900000000016, 546.7050012187285, 48.58413585049248, 73.67704117986771], "isController": false}, {"data": ["php-5.6-apache2", 121398, 0, 0.0, 112.50318786141509, 0, 3186, 286.0, 449.0, 715.9900000000016, 674.1561802370136, 142.20481926874507, 96.77827978011817], "isController": false}, {"data": ["php-5.6-nginx", 93610, 0, 0.0, 146.89272513620134, 0, 3555, 339.0, 484.9500000000007, 707.0, 519.9573413910705, 97.49200151082573, 74.64231365672596], "isController": false}, {"data": ["nodejs", 85230, 0, 0.0, 161.01328170831903, 0, 7426, 303.0, 418.0, 1071.9800000000032, 473.4132075786106, 110.95622052623686, 63.799826802586196], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1172952, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
