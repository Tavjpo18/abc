const $messages = document.querySelector('table #sinhvienjs')
const datad = document.querySelector('#data-template').innerHTML

let jSONData = []
axios({
    method: 'get',
    url: 'http://54.254.146.96:3000/sinhvien'
})
    .then((result) => {
        console.log(result.data)
        jSONData = result.data
        for (let i = 0; i < result.data.length; i++) {
            const html = Mustache.render(datad, {
                ...result.data[i]
            })
            $messages.insertAdjacentHTML('beforeend', html)
        }
        console.log($messages)
    })


const addSinhVien = document.getElementById('them').addEventListener('click', (e) => {
    axios({
        method: 'post',
        url: 'http://54.254.146.96:3000/sinhvien',
        data: {
            mssv: document.getElementById('mssv').value,
            hoten: document.getElementById('hoten').value,
            namsinh: document.getElementById('namsinh').value,
            email: document.getElementById('email').value
        }
    })
        .then((result) => {
            console.log(result)
        })
})

const del = (value) => {
    axios({
        method: 'delete',
        url: 'http://54.254.146.96:3000/sinhvien/' + value,
    })
        .then((result) => {
            console.log(result.data)
            location.reload()
        }).catch((error) => {
            console.log(error)
        })
}


const edit = (value) => {
    let editUer = null
    for(let i = 0; i< jSONData.length;i++){
        console.log(jSONData[i].mssv)
        if(jSONData[i].mssv === value.toString()){
            editUer = jSONData[i]
        }
    }
    document.getElementById('mssv').value = editUer.mssv
    document.getElementById('hoten').value = editUer.hoten
    document.getElementById('namsinh').value = editUer.namsinh
    document.getElementById('email').value = editUer.email

    document.getElementById('mssv').setAttribute('disabled','disabled')
    document.getElementById("them").style.visibility = "hidden";
    document.getElementById("them").style.display = "none";
    document.getElementById("sua").style.visibility = "visible";   
}


const editSinhVien = document.getElementById('sua').addEventListener('click', (e) => {
    e.preventDefault()
    axios({
        method: 'patch',
        url: 'http://54.254.146.96:3000/sinhvien/'+ document.getElementById('mssv').value,
        data: {
            hoten: document.getElementById('hoten').value,
            email: document.getElementById('email').value,
            namsinh: document.getElementById('namsinh').value
        }
    })
        .then((result) => {
            console.log(result.data)
            location.reload()
        })
})



document.getElementById("sua").style.visibility = "hidden";
