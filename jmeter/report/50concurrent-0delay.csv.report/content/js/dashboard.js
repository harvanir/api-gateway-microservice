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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9942737157203876, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9963974951573725, 500, 1500, "quarkus-vertx-resteasy-jvm"], "isController": false}, {"data": [0.9952212561866112, 500, 1500, "php-8.0-apache2"], "isController": false}, {"data": [0.9755180150455325, 500, 1500, "quarkus-vertx-resteasy-native"], "isController": false}, {"data": [0.9961742731118912, 500, 1500, "vertx-rxjava2"], "isController": false}, {"data": [0.9965135245869957, 500, 1500, "vertx-resteasy-rxjava2"], "isController": false}, {"data": [0.9917244276412518, 500, 1500, "webmvc"], "isController": false}, {"data": [0.9963618870080279, 500, 1500, "go"], "isController": false}, {"data": [0.9944469031211144, 500, 1500, "webflux"], "isController": false}, {"data": [0.9928563048870417, 500, 1500, "php-5.6-apache2"], "isController": false}, {"data": [0.9950679573888804, 500, 1500, "php-5.6-nginx"], "isController": false}, {"data": [0.9922789907274003, 500, 1500, "nodejs"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1197286, 0, 0.0, 79.15038094490475, 0, 7554, 131.0, 221.0, 1052.9900000000016, 6606.043886317114, 959.1314566568133, 907.5096476773329], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["quarkus-vertx-resteasy-jvm", 97571, 0, 0.0, 88.43444261102346, 0, 3395, 150.0, 212.0, 763.0, 541.9286396658595, 48.15967403280587, 73.03335182996933], "isController": false}, {"data": ["php-8.0-apache2", 143657, 0, 0.0, 59.80505648871999, 0, 7499, 88.0, 160.95000000000073, 1029.0, 798.0368084527229, 168.33588928299622, 114.56192465092799], "isController": false}, {"data": ["quarkus-vertx-resteasy-native", 45462, 0, 0.0, 189.59702608772199, 1, 7516, 383.0, 500.0, 1177.0, 251.1199368084977, 22.316322509348918, 33.8423352339577], "isController": false}, {"data": ["vertx-rxjava2", 155526, 0, 0.0, 55.23769659092357, 0, 7364, 83.0, 148.95000000000073, 628.9800000000032, 859.3973620082776, 77.21148174293118, 115.81722261439678], "isController": false}, {"data": ["vertx-resteasy-rxjava2", 129357, 0, 0.0, 66.55000502485399, 0, 7422, 100.0, 171.0, 442.0, 714.9560603548334, 76.1037212682391, 96.35150032125684], "isController": false}, {"data": ["webmvc", 71415, 0, 0.0, 120.87872295736223, 0, 7367, 189.0, 261.9500000000007, 1107.0, 396.5561281151437, 67.38356083206544, 53.44213445301742], "isController": false}, {"data": ["go", 166295, 0, 0.0, 51.823632700923575, 0, 7475, 85.0, 157.0, 714.9900000000016, 923.4968429119625, 116.33895774965153, 124.45562922055746], "isController": false}, {"data": ["webflux", 94902, 0, 0.0, 90.79638996016915, 0, 7312, 169.0, 234.0, 1032.0, 526.9288855328033, 46.82668806980966, 71.01190058938168], "isController": false}, {"data": ["php-5.6-apache2", 119336, 0, 0.0, 72.21170476637526, 0, 7554, 116.0, 180.0, 1058.9900000000016, 659.8325758329739, 139.18343396476794, 94.72205922602262], "isController": false}, {"data": ["php-5.6-nginx", 92558, 0, 0.0, 93.20673523628284, 0, 7401, 140.0, 208.95000000000073, 524.0, 512.0264648610373, 96.00496216144451, 73.50379915485595], "isController": false}, {"data": ["nodejs", 81207, 0, 0.0, 106.08340414003666, 0, 7353, 147.0, 205.0, 1125.0, 449.5988838507151, 105.37473840251133, 60.59047458144401], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1197286, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
