import './App.css';
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { urlGeneros } from "../src/utils/endpoints";

function App() {
  const baseURL = urlGeneros;
  const [data, setData] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [generoSeleccionado, setGeneroSeleccionado] = useState({
    id: "",
    nombre: ""
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setGeneroSeleccionado({
      ...generoSeleccionado,
      [name]: value
    });
    console.log(generoSeleccionado);
  }

  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar);
  }

  const peticionGet = async () => {
    await axios.get(baseURL)
      .then(response => {
        setData(response.data);
      }).catch(error => {
        console.log(error);
      })
  }

  const peticionPost = async () => {
    // gestorSeleccionado.id = parseInt(gestorSeleccionado.id);
    delete generoSeleccionado.id;
    await axios.post(baseURL, generoSeleccionado)
      .then(response => {
        setData(data.concat(response.data));
        abrirCerrarModalInsertar();
        peticionGet();
      }).catch(error => {
        console.log(error);
      })
  }

  const peticionPut = async () => {
    await axios.put(`${baseURL}/${generoSeleccionado.id}`, generoSeleccionado)
      .then(response => {
        var respuesta = response.data;
        var dataAuxiliar = data;
        // eslint-disable-next-line array-callback-return
        dataAuxiliar.map(genero => {
          if (genero.id === generoSeleccionado.id) {
            genero.nombre = respuesta.nombre;
          }
        })
        abrirCerrarModalEditar();
        peticionGet();
      }).catch(error => {
        console.log(error);
      })
  }

  const peticionDelete = async () => {
    await axios.delete(`${baseURL}/${generoSeleccionado.id}`)
      .then(response => {
        setData(data.filter(genero => genero.id !== response.data));
        abrirCerrarModalEliminar();
        peticionGet();
      }).catch(error => {
        console.log(error);
      })
  }

  const seleccionarGenero = (genero, caso) => {
    setGeneroSeleccionado(genero);
    (caso === "Editar") ?
    abrirCerrarModalEditar() : abrirCerrarModalEliminar();
  }

  useEffect(() => {
    peticionGet();
  }, []);

  return (
    <div className="App">
      <br /><br />
      <button onClick={() => abrirCerrarModalInsertar()} className="btn btn-success">Insertar Nuevo Gestor</button>
      <br /><br />
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map(genero => (
            <tr key={genero.id}>
              <td>{genero.id}</td>
              <td>{genero.nombre}</td>
              <td>
                <button className="btn btn-primary" onClick={() => seleccionarGenero(genero, "Editar")}>Editar</button>{" "}
                <button className="btn btn-danger" onClick={() => seleccionarGenero(genero, "Eliminar")}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalInsertar}>
        <ModalHeader>Insertar Género</ModalHeader>
        <ModalBody>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <br />
            <input type="text" className="form-control" name="nombre" onChange={handleChange} />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => peticionPost()}>Insertar</button>{" "}
          <button className="btn btn-danger" onClick={() => abrirCerrarModalInsertar()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Género</ModalHeader>
        <ModalBody>
          <div className="mb-3">
            <label className="form-label">ID</label>
            <br />
            <input type="text" className="form-control" name="id" value={generoSeleccionado && generoSeleccionado.id} readOnly />
            <br />
            <label className="form-label">Nombre</label>
            <br />
            <input type="text" className="form-control" name="nombre" value={generoSeleccionado && generoSeleccionado.nombre} onChange={handleChange} />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => peticionPut()}>Editar</button>{" "}
          <button className="btn btn-danger" onClick={() => abrirCerrarModalEditar()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEliminar}>
        <ModalBody>
          ¿Estás seguro que deseas eliminar el género {generoSeleccionado && generoSeleccionado.id}?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={() => peticionDelete()}>Si</button>
          <button className="btn btn-secondary" onClick={() => abrirCerrarModalEliminar()}>No</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
