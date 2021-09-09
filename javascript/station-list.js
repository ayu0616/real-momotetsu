const createTable = () => {
    const tbody = $('#tbody');
    let tr = $('<tr></tr>');
    let td1 = $('<td></td>');
    let td2 = $('<td></td>');
    let td3 = $('<td></td>');
    let td4 = $('<td></td>');
    tr.append(td1, td2, td3, td4)
    tbody.append(tr)
}

createTable()