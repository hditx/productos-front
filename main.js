let productoState = []
const stringToHTML = (string) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(string, 'text/html')
    return doc.body.firstChild.firstChild.firstChild
}

const renderItem = (item) => {
    const element = stringToHTML(`<table><tr> 
            <td>${item.id}</td>
            <td>${item.nombre}</td>
            <td>${item.descripcion}</td>
            <td>${item.imagen}</td>
            <td><button class="btn btn-danger" onclick="deleteProducto(${item.id})">Delete</button> <button class="btn btn-primary" onclick="updateProducto(${item.id})">Update</button></td>
        </tr></table>`)
    return element
}
const deleteProducto = (id) => {
    fetch('http://localhost:3000/api/productos/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(x => {
        x.json()
        inicializaDatos()
    })
}
const updateProducto = (id) => {
    fetch('http://localhost:3000/api/productos/' + id)
    .then(response => response.json())
    .then(data => {
        renderForm()
        const nombre = document.getElementById('nombre')
        const descripcion = document.getElementById('descripcion')
        const imagen = document.getElementById('imagen')
        nombre.value = data.nombre
        descripcion.value = data.descripcion
        imagen.value = data.imagen
    })
}

const inicializaDatos = () => {
    fetch('http://localhost:3000/api/productos')
    .then(response => response.json())
    .then(data => {
        productoState = data
        const productosList = document.getElementById('productos-list')
        productosList.innerHTML = ''
        const listItems = data.map(renderItem)
        listItems.forEach(element => productosList.appendChild(element))
    })
}

const renderApp = () => {
    renderProductos()
}

const renderForm = () => {
    const formTemplate = document.getElementById('form-template')
    document.getElementById('app').innerHTML = formTemplate.innerHTML

    const formProducto = document.getElementById('productos-form')
    formProducto.onsubmit = (e) => {
        e.preventDefault()
        const nombre = document.getElementById('nombre').value
        const descripcion = document.getElementById('descripcion').value
        const imagen = document.getElementById('imagen').value
        fetch('http://localhost:3000/api/productos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, descripcion, imagen })
        }).then(x => {
            x.json()
            renderProductos()
        })
    }
    
}

const renderProductos = () => {
    const productosView = document.getElementById('productos-table')
    document.getElementById('app').innerHTML = productosView.innerHTML
    inicializaDatos()
}

window.onload = () => {
    renderApp()
}