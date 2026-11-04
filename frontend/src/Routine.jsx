import {useEffect, useState} from "react";
import './routine.css'

export default function Routine({session, parentIndex, selectedRoutineArray, setSelectedRoutineArray}) {


    const [routinePopUpState, setRoutinePopUpState] = useState(false);
    const [savedRoutinePopUpState, setSavedRoutinePopUpState] = useState(false)
    const [routineName, setRoutineName] = useState('')
    const [productArray, setProductArray] = useState([])
    const [productSearchArray, setProductSearchArray] = useState([])
    const [productName, setProductName] = useState('')
    const [routineTime, setRoutineTime] = useState('')
    const [routineIndex, setRoutineIndex] = useState(0);
    const [timeButtonStyleOne, setTimeButtonStyleOne] = useState("timeButtonStyleGray")
    const [timeButtonStyleTwo, setTimeButtonStyleTwo] = useState("timeButtonStyleGray")
    const [timeButtonStyleThree, setTimeButtonStyleThree] = useState("timeButtonStyleGray")
    const [savedRoutineArray, setSavedRoutineArray] = useState([])
    const [editedProductArray, setEditedProductArray] = useState([])
    const [editedRoutineName, setEditedRoutineName] = useState('')
    const [routineId, setRoutineId] = useState('')


    const groupRoutines = (rows) => {
        return Object.values(
            rows.reduce((acc, row) => {
                (acc[row.routineId] ??= {
                    id: row.routineId,
                    name: row.routineName,
                    time: row.routineTime,
                    products: []
                }).products.push(row)
                return acc
            }, {})
        )
    }

    const getSavedRoutines = async () => {
        if (!session) return;
        try{
            const response = await fetch(`http://localhost:8080/api/v1/routine/get`,
                {
                    method: 'GET',
                    headers: {'Authorization': `Bearer ${session.access_token}`},
                })
            if(!response.ok){
                console.log("Error fetching routine")
                return
            }
            const data = await response.json()
            setSavedRoutineArray(groupRoutines(data))
        }
        catch(error){
            console.log(error)
        }
    }

    useEffect(() => {
        getSavedRoutines()
    }, []);

    const handleProductSearch = async(productName) => {
        if (!productName || !productName.trim()) return
        const response = await fetch(`http://localhost:8080/api/v1/products/search?productName=${productName}`, {
            method: 'GET',
            headers: {'Authorization': `Bearer ${session.access_token}`}
        })
        const text = await response.text()

        if (text) {
            const productionList = JSON.parse(text)
            setProductSearchArray(productionList)
        } else {
            setProductSearchArray([])
        }
    }
    const handleProductEntry = async(productLog) => {
        const response = await fetch(`http://localhost:8080/api/v1/products/add`, {
            method: 'POST',
            headers: {'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',},
            body: JSON.stringify(
                productLog
            )
        })

        setProductArray([...productArray, productName]);
        return response.json();
    }

    const timeTranslator = (time) => {
        if(time === "AM")
        {return 1}
        else if(time === "PM")
        {return 2}
        else
        {return 3}
    }

    const handleRoutineEntry = async(productArray, routineName, routineTime) => {
        const params = new URLSearchParams()
        params.append('routineName', routineName)
        params.append('routineTime', routineTime)
        productArray.forEach((product) => {params.append('productArray', product)})
        const response = await fetch(`http://localhost:8080/api/v1/routine/add?${params.toString()}`, {
            method: 'POST',
            headers: {'Authorization': `Bearer ${session.access_token}`}
        })
        return response.ok
    }

    const handleRoutineUpdate = async(editedProductArray, editedRoutineName, routineTime, routineId) => {

        const params = new URLSearchParams()
        params.append('routineName', editedRoutineName)
        params.append('routineTime', routineTime)
        params.append('routineId', routineId)
        editedProductArray.forEach((product) => {params.append('editedProductArray', product.productId)})
        const response = await fetch(`http://localhost:8080/api/v1/routine/update?${params.toString()}`, {
            method: 'PUT',
            headers: {'Authorization': `Bearer ${session.access_token}`}
        })
        return response.ok
    }

    function handleTimeButtonClick(buttonNumber){
        if(buttonNumber === 1){
            setTimeButtonStyleOne("timeButtonStyleBlue");
            setTimeButtonStyleTwo("timeButtonStyleGray");
            setTimeButtonStyleThree("timeButtonStyleGray");
        }
        else if(buttonNumber === 2){
            setTimeButtonStyleOne("timeButtonStyleGray");
            setTimeButtonStyleTwo("timeButtonStyleBlue");
            setTimeButtonStyleThree("timeButtonStyleGray");
        }
        else if(buttonNumber === 3){
            setTimeButtonStyleOne("timeButtonStyleGray");
            setTimeButtonStyleTwo("timeButtonStyleGray");
            setTimeButtonStyleThree("timeButtonStyleBlue");


        }
        else{
            setTimeButtonStyleOne("timeButtonStyleGray");
            setTimeButtonStyleTwo("timeButtonStyleGray");
            setTimeButtonStyleThree("timeButtonStyleGray");
        }
    }
    function moveUp(index, array, setArray){
        if(index === 0) return;
        const newArray = [...array];
        const temp = newArray[index];
        newArray[index] = newArray[index - 1];
        newArray[index - 1] = temp;

        setArray(newArray);
    }
    function moveDown(index, array, setArray){
        const newArray = [...array];
        const temp = newArray[index];
        newArray[index] = newArray[index + 1];
        newArray[index + 1] = temp;

        setArray(newArray);
    }
    function removeProduct(index, array, setArray){
        setArray(array.filter((_, i) => i !== index))
    }
    const handleRoutineSubmit = async () => {
        if(routineName.trim() === "" || routineTime.trim() === "" || productArray.length === 0){
            return;
        }else{
            const saved = await handleRoutineEntry(productArray, routineName, routineTime)
            if(!saved) return;

            await getSavedRoutines()

            setProductName("")
            setRoutineTime("")
            setProductArray([])
            setRoutineName("")
            setRoutinePopUpState(false)
        }

    }
    const handleEditedRoutineSubmit = async() => {
        if (editedRoutineName === "" || editedProductArray.length === 0 || routineTime === "") {
            return;
        } else {
            const saved = await handleRoutineUpdate(editedProductArray, editedRoutineName, routineTime, routineId)
            if (!saved) return;
            await getSavedRoutines()

            setSavedRoutinePopUpState(false);
            setRoutineTime("")
            setEditedRoutineName("")
            setEditedProductArray([])
        }
    }

    const handleRoutineDelete = async(routineId) => {
        try {
            await fetch(`http://localhost:8080/api/v1/routine/deleteRoutine?routineId=${routineId}`, {
                method: 'DELETE',
                headers: {'Authorization': `Bearer ${session.access_token}`}
            })
            await getSavedRoutines();
            setSavedRoutinePopUpState(false);
        } catch (error) {
            console.log(error);
        }
    }

    const handleEditedProductEntry = async(product) => {
        const response = await handleProductEntry(product);
        if(response.length === 0){
            setEditedProductArray(prev => [...prev, {productId: product.id, productName: product.productName}])
        }
        else{
            setEditedProductArray(prev => [...prev, {productId: response[0].id, productName: response[0].productName}])
        }
    }

    const handleSelectedRoutineButton = (routineId) => {
        if(selectedRoutineArray.includes(routineId)){
            setSelectedRoutineArray(selectedRoutineArray.filter(id => id !== routineId));
        }
        else if (selectedRoutineArray.length >= 2){
            return;
        }
        else{
            setSelectedRoutineArray([...selectedRoutineArray, routineId]);
        }
    }

    return(
        <div className="routineContainer">
            <div className="routineTextDividerButtonContainer">
                <div className="routineButtonAndTextContainer">
                    <p className="homePageRoutineText">Routine</p>
                    {routinePopUpState ? <button className={`addRoutineButton${parentIndex}`} onClick={() => setRoutinePopUpState(false) }>x</button> : <button className={`addRoutineButton${parentIndex}`} onClick={() => setRoutinePopUpState(true)}>+</button>}
                </div>
                <hr className="subDividerSix"></hr>
            </div>
            <div className="routineInnerContainer">
                {routinePopUpState ? (
                        <div className="routineInnerContainerForFlex">
                            <div className="routineInnerContainerWithoutButton">
                                <div>
                                    <div className="routineFormIndividualContainer">
                                        <div className="routineNameContainer">
                                            <input type="text" value={routineName} placeholder="Routine Name..." className={`routineTextBox${parentIndex}`} onChange={(event) => {setRoutineName(event.target.value)}}/>
                                            <div className="timeSetButtonContainer">
                                                <button className={`${timeButtonStyleOne}${parentIndex}`} onClick={() => {setRoutineTime("AM"); handleTimeButtonClick(1)}}>AM</button>
                                                <button className={`${timeButtonStyleTwo}${parentIndex}`} onClick={() => {setRoutineTime("PM"); handleTimeButtonClick(2)}}>PM</button>
                                                <button className={`${timeButtonStyleThree}${parentIndex}`} onClick={() => {setRoutineTime("AMPM"); handleTimeButtonClick(3)}}>AM&#183;PM</button>
                                            </div>
                                        </div>
                                        <hr className="routineDivider"></hr>
                                    </div>
                                    <div className="routineProductSubmitContainer">
                                        <input id="productNameEntry" type ="text" className={`productEntryTextBox${parentIndex}`} value={productName} onChange={(event) => setProductName(event.target.value)}  placeholder="Product Name..."/>
                                        <button className={`productSearchButton${parentIndex}`} onClick={() => {handleProductSearch(productName); setProductNamePlaceholder(productName); setProductName("")}}>Search</button>
                                    </div>
                                    {productSearchArray.length > 0 ? (
                                        <div className="productSearchContaienr">
                                            <hr className="subDividerEight"></hr>
                                            <p>Search Suggestions:</p>
                                            {productSearchArray.map(product => <button className="productContainer" onClick={() => {handleProductEntry(product); setProductArray([...productArray, product.productName]); setProductSearchArray([])}}>{product.productName} &#183; {product.brand} &#183; {product.productCategory}</button>)}
                                            <button className="productContainer" onClick={() => {alert("Please type in the exact name with the brand."); setProductNamePlaceholder(""); setProductSearchArray([])}}>None of the Above</button>
                                        </div>
                                    ) : null
                                    }

                                </div>
                                <div className="enteredProductArray">
                                    {productArray.map((product, index) => (
                                        <div className="individualProductContainer">
                                            <div className="listMoveAndIndexContainer">
                                                <div className="listMoveButtonContainer">
                                                    <button className={`moveListUpBotton${parentIndex}`} onClick={() => moveUp(index, productArray, setProductArray)} disabled={index === 0}>&#8963;</button>
                                                    <button className={`moveListUpBotton${parentIndex}`} onClick={() => moveDown(index, productArray, setProductArray)} disabled={index === productArray.length - 1}>&#8964;</button>
                                                </div>
                                                <p className="addedProductName">{index + 1}. {product}</p>
                                            </div>
                                            <div className="listMoveAndRemoveButtonContainer">
                                                <button className={`deleteProductButton${parentIndex}`} onClick={() => removeProduct(index, productArray, setProductArray)}>X</button>
                                            </div>
                                        </div>
                                    ))}
                                </div></div>
                            <div>
                                <div className="routineSubmitButtonContainer">
                                    <button className="routineSubmitButton" onClick={() => {handleRoutineSubmit(); handleTimeButtonClick(4)}}>Submit</button>
                                </div>
                            </div>
                        </div>)




                    :




                    (
                        <div className="savedRoutineContainer">
                            {savedRoutinePopUpState ? (
                                <div>
                                    <div className="selectedRoutineAndCloseDropDownContainer">
                                        <div className="routineNameContainer">
                                            <input type="text" value={editedRoutineName} placeholder="Routine Name..." className={`routineTextBox${parentIndex}`} onChange={(event) => {setEditedRoutineName(event.target.value)}}/>
                                            <div className="timeSetButtonContainer">
                                                <button className={`${timeButtonStyleOne}${parentIndex}`} onClick={() => {setRoutineTime("AM"); handleTimeButtonClick(1)}}>AM</button>
                                                <button className={`${timeButtonStyleTwo}${parentIndex}`} onClick={() => {setRoutineTime("PM"); handleTimeButtonClick(2)}}>PM</button>
                                                <button className={`${timeButtonStyleThree}${parentIndex}`} onClick={() => {setRoutineTime("AMPM"); handleTimeButtonClick(3)}}>AM&#183;PM</button>
                                            </div>
                                        </div>
                                        <div className="deleteAndRoutineDropDownButtonContainer">
                                            <button className={`routineDeleteButton${parentIndex}`} onClick={() => {handleRoutineDelete(routineId); setProductSearchArray([])}}>Delete</button>
                                            <button className={`closeRoutinePopUpState${parentIndex}`} onClick={() => {setSavedRoutinePopUpState(false); setProductSearchArray([])}}>&#8963;</button>
                                        </div>
                                    </div>


                                    <div className="routineProductSubmitContainer">
                                        <input id="productNameEntry" type ="text" className={`productEntryTextBox${parentIndex}`} value={productName} onChange={(event) => setProductName(event.target.value)}  placeholder="Product Name..."/>
                                        <button className={`productSearchButton${parentIndex}`} onClick={() => {handleProductSearch(productName); setProductName("")}}>Search</button>
                                    </div>

                                    {productSearchArray.length > 0 ? (
                                        <div className="productSearchContaienr">
                                            <hr className="subDividerEight"></hr>
                                            <p>Search Suggestions:</p>
                                            {productSearchArray.map(product => <button className="productContainer" onClick={() => {handleEditedProductEntry(product); setProductSearchArray([])}}>{product.productName} &#183; {product.brand} &#183; {product.productCategory}</button>)}
                                            <button className="productContainer" onClick={() => {alert("Please type in the exact name with the brand."); setProductSearchArray([])}}>None of the Above</button>
                                        </div>
                                    ) : null
                                    }
                                    <div className={`overFlowEditedProductContainer${parentIndex}`}>
                                        {editedProductArray.map((product, index) => (
                                            <div className="individualProductContainer">
                                                <div className="listMoveAndIndexContainer">
                                                    <div className="listMoveButtonContainer">
                                                        <button className={`moveListUpBotton${parentIndex}`} onClick={() => moveUp(index, editedProductArray, setEditedProductArray)} disabled={index === 0}>&#8963;</button>
                                                        <button className={`moveListUpBotton${parentIndex}`} onClick={() => moveDown(index, editedProductArray, setEditedProductArray)} disabled={index === editedProductArray.length - 1}>&#8964;</button>
                                                    </div>
                                                    <p className="addedProductName">{index + 1}. {product.productName}</p>
                                                </div>
                                                <div className="listMoveAndRemoveButtonContainer">
                                                    <button className={`deleteProductButton${parentIndex}`} onClick={() => removeProduct(index, editedProductArray, setEditedProductArray)}>x</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>{editedProductArray.length > 0 ? (<hr className="subDividerThree"></hr>) : null}
                                    <div className="submitChangesRoutineButtonContainer">
                                        <button className="routineSubmitChangesButton" onClick={() => {handleEditedRoutineSubmit(editedProductArray, editedRoutineName, routineTime, routineIndex); setProductSearchArray([])}}>Submit Changes</button>
                                    </div>
                                </div>) : (
                                <div>
                                    <div className={`savedRoutineInnerContainer${parentIndex}`}>
                                        {savedRoutineArray.map((routine, index) => (
                                            <div className="singleRoutineEntry" key={routine.id}>
                                                <p className="savedRoutineText">
                                                    {index + 1}. {routine.name} {routine.time}
                                                </p>
                                                <div className="selectRoutineAndDropDownMenuButtonContainer">
                                                {parentIndex === "popUp" ? (
                                                    <button disabled={!selectedRoutineArray.includes(routine.id) && selectedRoutineArray.length >= 2} className={selectedRoutineArray.includes(routine.id) ? "selectedRoutineButtonBlue" : "selectedRoutineButtonGray"} onClick={() => handleSelectedRoutineButton(routine.id)}>Select</button>
                                                ) : null}
                                                    <button className={`routineProductDropDownButton${parentIndex}`} onClick={() => {setRoutineIndex(index); setRoutineId(routine.id); setRoutineTime(routine.time); setEditedRoutineName(routine.name); setEditedProductArray(routine.products); setSavedRoutinePopUpState(true); handleTimeButtonClick(timeTranslator(routine.time))}}>&#8964;</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {savedRoutineArray.length > 0 ? (<hr className="subDividerThree"></hr>) : null}
                                </div>
                            )}
                        </div>)
                }
            </div>
        </div>
    )
}