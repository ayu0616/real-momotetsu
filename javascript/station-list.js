// const createTable = () => {
//     const tbody = $('#tbody');
//     let tr = $('<tr></tr>');
//     let td1 = $('<td></td>');
//     let td2 = $('<td></td>');
//     let td3 = $('<td></td>');
//     let td4 = $('<td></td>');
//     tr.append(td1, td2, td3, td4)
//     tbody.append(tr)
// }

// createTable()

$(function(){
    $('#view1').csv2table('/山陽本線（岡山→宮島口）.csv');
    });