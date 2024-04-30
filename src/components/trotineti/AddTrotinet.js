import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import TestAxios from '../../apis/TestAxios'

const AddTrotinet = () => {
    const navigate = useNavigate();

    const blank_data = {
        sifra: "",
        maksimalnaBrzina: "",
        adresaId: "",
    }

    const [data, setData] = useState(blank_data)
    const [adrese, setAdrese] = useState([])

   

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
        getAdrese()
      }, [])

    const valueInputChanged = (e) => {
        const { name, value } = e.target;
        data[name] = value;
        setData(data)
        console.log(data)
    }

    const createAction = (e) => {
        TestAxios.post("/trotineti", data)
            .then(() => {
                navigate("/trotineti")
            }).catch(ex => {
                console.log(ex)
                alert("Error happend while creating new Trotinet.")
            });
    }

    return (
        <>
            <Form onSubmit={(e) => {
                e.preventDefault();
                createAction()
            }}>
                <Form.Group>
                    <Form.Label>Sifra</Form.Label>
                    <Form.Control name="sifra" type="text" onChange={e => valueInputChanged(e)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Maksimalna Brzina</Form.Label>
                    <Form.Control name="maksimalnaBrzina" placeholder='Maksimalna brzina (km/h)' type="number" onChange={e => valueInputChanged(e)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Adresa</Form.Label>
                    <Form.Control as='select' name="adresaId" type="text" onChange={e => valueInputChanged(e)}>
                        <option value="" >Izaberi adresu</option>
                        {adrese.map((a) => {
                            return <option key={a.id} value={a.id} >{a.ulica + " " + a.broj}</option>
                        })}
                    </Form.Control>
                </Form.Group>

                <Form.Group style={{ marginTop: "1rem" }}>
                    <Button type='sumbit' > Kreiraj trotinet</Button>
                </Form.Group>

            </Form>
        </>
    )
}

export default AddTrotinet