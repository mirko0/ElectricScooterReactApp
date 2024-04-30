import React, { useCallback, useState } from 'react'
import { Button, ButtonGroup, ButtonToolbar, Col, Collapse, Form, Modal, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
import TestAxios from '../../apis/TestAxios';

const ViewTrotineti = ({ userRole }) => {
  const navigate = useNavigate();

  const empty_search = {
    adresaId: "",
    nivoBaterijeOd: "",
    nivoBaterijeDo: "",
    pageNo: 0,
    pageSize: 5,
  }

  const [searchParams, setSearchParams] = useState(empty_search)
  const [totalPages, setTotalPages] = useState(1);
  const [trotineti, setTrotineti] = useState([])
  const [adrese, setAdrese] = useState([])

  const [iznajmiModal, setIznajmiModal] = useState(false);
  const [vracanjeModal, setVracanjeModal] = useState(false);
  const rez_data = {
    email: "",
    trotinetId: "",
  }
  const [iznajmiData, setIznajmiData] = useState(rez_data)
  const vrac_data = {
    email: "",
    trotinetId: "",
    stanjeBaterije: "",
    adresaId: "",
  }
  const [vracanjeData, setVracanjeData] = useState(vrac_data)

  const handleClose = () => setIznajmiModal(false);
  const handleShow = () => setIznajmiModal(true);

  const getTrotineti = useCallback(() => {
    let config = {
      params: searchParams,
    }

    TestAxios.get('/trotineti', config)
      .then(res => {
        console.log(res);
        setTrotineti(res.data)
        setTotalPages(res.headers["total-pages"])
        console.log("Total Pages: " + totalPages)
        console.log("Current Page: " + searchParams["pageNo"])
      })
      .catch(ex => {
        console.log(ex)
        alert("Error while loading Trotineti.")
      })

  })


  const getAdrese = useCallback(() => {
    TestAxios.get('/adrese')
      .then(res => {
        console.log(res);
        setAdrese(res.data)
      })
      .catch(ex => {
        console.log(ex)
        alert("Error while loading Adresses.")
      })
  })


  useEffect(() => {
    getTrotineti()
    getAdrese()
  }, [])


  const deleteAction = (id) => {
    TestAxios.delete("/trotineti/" + id)
      .then(() => {
        let nextPage;
        if (searchParams["pageNo"] == (totalPages - 1) && adrese.length == 1)
          nextPage = searchParams["pageNo"] - 1;
        else
          nextPage = searchParams["pageNo"];
        if (nextPage < 0) nextPage = 0;
        searchParams["pageNo"] = nextPage;
        setSearchParams(searchParams)
        getTrotineti()
      }).catch((ex) => {
        console.log(ex)
        alert("Error while perfoming delete action.")
      })
  }

  const valueInputChanged = (e) => {
    const { name, value } = e.target;
    searchParams[name] = value;
    setSearchParams(searchParams)
    console.log(searchParams)
  }

  const valueInputChangedReturnTrotinet = (e) => {
    const { name, value } = e.target;
    vracanjeData[name] = value;
    setVracanjeData(vracanjeData)
    console.log(vracanjeData)
  }

  const changePage = (pageNo) => {
    if (pageNo < 0) pageNo = 0;
    searchParams["pageNo"] = pageNo;
    setSearchParams(searchParams);
    getTrotineti();
  }

  const returnTrotinetAction = (id) => {
    TestAxios.put("/rezervacije", vracanjeData)
      .then((res) => {
        console.log(res)
        getTrotineti()
      }).catch((ex) => {
        console.log(ex)
        alert("Doslo je do greske pri vracanju trotineta.")
      })
  }

  const rentAction = () => {
    TestAxios.post("/rezervacije", iznajmiData)
      .then(() => {
        iznajmiData["trotinetId"] = null;
        iznajmiData["email"] = null;
        setIznajmiData(iznajmiData);
        window.location.reload()
      }).catch(ex => {
        console.log(ex)
        alert("Doslo je do greske pri iznajmljivanju trotineta probajte opet.")
      });
  }

  const fuelAction = (id) => {
    TestAxios.post("/trotineti/" + id + "/fuelup")
      .then(() => {
        getTrotineti()
      }).catch((ex) => {
        console.log(ex)
        alert("Error while fueling up.")
      })
  }



  return (
    <>

      <Modal show={iznajmiModal} onHide={e => setIznajmiModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Forma Za Iznajmljivanje</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {
            e.preventDefault()
            setIznajmiModal(false)
            rentAction();
          }}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control name="email" placeholder="Unesite vas email" type="email" onChange={e => {
                iznajmiData["email"] = e.target.value;
                setIznajmiData(iznajmiData);
              }} />
            </Form.Group>
            <Form.Group style={{ marginTop: "1rem" }}>
              <Button type='sumbit'> Iznajmite Trotinet</Button>
            </Form.Group>

          </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={e => {
            setIznajmiModal(false);
            iznajmiData["trotinetId"] = null;
            iznajmiData["email"] = null;
            setIznajmiData(iznajmiData);
          }}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={vracanjeModal} onHide={e => setVracanjeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Forma Za Vracanje Trotineta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {
            e.preventDefault()
            setVracanjeModal(false)
            returnTrotinetAction()
          }}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control name="email" placeholder="Unesite email kojim ste iznajmili trotinet" type="email" onChange={e => {
                valueInputChangedReturnTrotinet(e)
              }} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Adresa</Form.Label>
              <Form.Control as='select' name="adresaId" type="text" onChange={e => valueInputChangedReturnTrotinet(e)}>
                <option value="" >Izaberi adresu</option>
                {adrese.map((a) => {
                  return <option key={a.id} value={a.id} >{a.ulica + " " + a.broj}</option>
                })}
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Stanje Baterije</Form.Label>
              <Form.Control name="stanjeBaterije" placeholder="Unesite stanje baterije" type="number" onChange={e => {
                valueInputChangedReturnTrotinet(e)
              }} />
            </Form.Group>


            <Form.Group style={{ marginTop: "1rem" }}>
              <Button type='sumbit'> Vratite Trotinet</Button>
            </Form.Group>

          </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={e => {
            setVracanjeModal(false);
            setVracanjeData(vrac_data);
          }}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>


      <Form onSubmit={(e) => {
        e.preventDefault()
        getTrotineti();
      }}>

        <Form.Group>
          <Form.Label>Adresa</Form.Label>
          <Form.Control as='select' name="adresaId" type="text" onChange={e => valueInputChanged(e)}>
            <option value="" >Izaberi adresu</option>
            {adrese.map((a) => {
              return <option key={a.id} value={a.id} >{a.ulica + " " + a.broj}</option>
            })}
          </Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label>Nivo Baterije Od</Form.Label>
          <Form.Control name="nivoBaterijeOd" placeholder="Nivo Baterije Od" type="number" onChange={e => valueInputChanged(e)} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Nivo Baterije Do</Form.Label>
          <Form.Control name="nivoBaterijeDo" placeholder="Nivo Baterije Do" type="number" onChange={e => valueInputChanged(e)} />
        </Form.Group>

        <Form.Group style={{ marginTop: "1rem" }}>
          <Button type='sumbit' onClick={e => getTrotineti()} > Pretraga</Button>
        </Form.Group>

      </Form>

      <ButtonToolbar
        className="justify-content-between"
        aria-label="Toolbar with Button groups"
        style={{ marginTop: "1rem", marginBottom: "0.5rem" }}
      >
        <div>
          {userRole == "ROLE_ADMIN" &&
            <Button variant="warning" onClick={e => navigate("/trotineti/add")}>Dodaj Trotinet</Button>
          }
        </div>
        <div>
          <Button variant="secondary" disabled={searchParams["pageNo"] == 0 || totalPages == 0} onClick={() => changePage(searchParams["pageNo"] - 1)}>Prethodna</Button>
          <Button variant="secondary" disabled={searchParams["pageNo"] == (totalPages - 1) || totalPages == 0} onClick={() => changePage(searchParams["pageNo"] + 1)}>Sledeca</Button>
        </div>
      </ButtonToolbar>
      <Table variant="primary" striped hover>
        <thead>
          <tr>
            <th>Sifra</th>
            <th>Maksimalna Brzina (km/h)</th>
            <th>Nivo baterije</th>
            <th>Trenutna adresa</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {trotineti.map((tr) => {
            return (
              <tr key={tr.id}>
                <td>{tr.sifra}</td>
                <td>{tr.maksimalnaBrzina}km/h</td>
                <td>{tr.nivoBaterije}%</td>
                <td>{tr.adresaUlica}{' '} {tr.adresaBroj}</td>
                {userRole == "ROLE_KORISNIK" && <>
                  <td>{
                    (!tr.iznajmljen && parseInt(tr.nivoBaterije) >= 10) &&
                    <Button variant='warning' onClick={e => {
                      setIznajmiModal(true); iznajmiData["trotinetId"] = tr.id;
                      setIznajmiData(iznajmiData);
                    }}>Iznajmi</Button>} {tr.iznajmljen && "Iznajmljen"}
                  </td>
                  <td>
                    {tr.iznajmljen &&
                      <Button onClick={(e) => {
                        setVracanjeModal(true);
                        vracanjeData["trotinetId"] = tr.id;
                        setVracanjeData(vracanjeData);
                      }}>Vrati trotinet</Button>
                    }
                  </td>
                </>}
                {userRole == "ROLE_ADMIN" &&
                  <>
                    <td>{!tr.iznajmljen && <Button variant='danger' onClick={e => deleteAction(tr.id)}>Obrisi</Button>} {tr.iznajmljen && "Iznajmljen"}</td>
                    <td>{(!tr.iznajmljen && (parseInt(tr.nivoBaterije) !== 100)) && <Button variant='success' onClick={e => fuelAction(tr.id)}>Napuni trotinet</Button>}</td>
                  </>
                }

              </tr>
            )
          })}
        </tbody>
      </Table>
    </>
  )
}

export default ViewTrotineti