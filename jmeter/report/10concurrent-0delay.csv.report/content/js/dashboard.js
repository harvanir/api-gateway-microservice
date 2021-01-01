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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9955086146336192, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9949749095904236, 500, 1500, "quarkus-vertx-resteasy-jvm"], "isController": false}, {"data": [0.9966618758403264, 500, 1500, "php-8.0-apache2"], "isController": false}, {"data": [0.9896370816638321, 500, 1500, "quarkus-vertx-resteasy-native"], "isController": false}, {"data": [0.9967572882089768, 500, 1500, "vertx-rxjava2"], "isController": false}, {"data": [0.9961059022935485, 500, 1500, "vertx-resteasy-rxjava2"], "isController": false}, {"data": [0.9924416900464804, 500, 1500, "webmvc"], "isController": false}, {"data": [0.9969237097147362, 500, 1500, "go"], "isController": false}, {"data": [0.9945315677678854, 500, 1500, "webflux"], "isController": false}, {"data": [0.9961877469946825, 500, 1500, "php-5.6-apache2"], "isController": false}, {"data": [0.9951602397081813, 500, 1500, "php-5.6-nginx"], "isController": false}, {"data": [0.9944572328567967, 500, 1500, "nodejs"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 888256, 0, 0.0, 21.558063216009646, 0, 3219, 22.0, 33.0, 1025.0, 4917.353587581725, 725.3724136233856, 676.375539021283], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["quarkus-vertx-resteasy-jvm", 71342, 0, 0.0, 24.43874575986078, 0, 3147, 22.0, 30.0, 1019.0, 395.0692487027982, 35.1086929999557, 53.24175421971304], "isController": false}, {"data": ["php-8.0-apache2", 107845, 0, 0.0, 16.08046733738212, 0, 3106, 15.0, 20.0, 92.0, 597.4626741641506, 126.02728283150051, 85.76856748254896], "isController": false}, {"data": ["quarkus-vertx-resteasy-native", 34691, 0, 0.0, 50.42570119051092, 0, 3219, 65.0, 102.0, 1050.0, 192.12471963005012, 17.073583482748596, 25.891807918893473], "isController": false}, {"data": ["vertx-rxjava2", 110864, 0, 0.0, 15.65860874585079, 0, 3178, 12.0, 16.0, 52.0, 613.9736830446147, 55.16169808603961, 82.7425471290594], "isController": false}, {"data": ["vertx-resteasy-rxjava2", 93218, 0, 0.0, 18.630189448389896, 0, 3104, 16.0, 22.0, 102.87000000002081, 516.3202118054978, 54.959866295702405, 69.58221604410029], "isController": false}, {"data": ["webmvc", 47762, 0, 0.0, 36.56919726979598, 0, 3105, 33.0, 46.0, 1040.0, 264.4219057953363, 44.93106602381691, 35.634983398199616], "isController": false}, {"data": ["go", 116699, 0, 0.0, 14.866108535634375, 0, 3081, 12.0, 16.0, 54.0, 646.2060678549873, 81.40681909501303, 87.08636461326977], "isController": false}, {"data": ["webflux", 66381, 0, 0.0, 26.25496753589176, 0, 3121, 24.0, 35.0, 1016.0, 367.517439929133, 32.660241243702245, 49.52871749044956], "isController": false}, {"data": ["php-5.6-apache2", 96662, 0, 0.0, 18.003703627071538, 0, 3123, 16.0, 22.0, 65.0, 535.3752423151481, 112.93071517585156, 76.85562560578786], "isController": false}, {"data": ["php-5.6-nginx", 76760, 0, 0.0, 22.673840541948913, 0, 3103, 19.0, 26.0, 1018.0, 425.1995546372564, 79.7249164944856, 61.039389191090535], "isController": false}, {"data": ["nodejs", 66032, 0, 0.0, 26.417221952992573, 0, 3164, 21.0, 28.0, 1022.9900000000016, 365.82014802996054, 85.739097194522, 49.29998088685016], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 888256, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
