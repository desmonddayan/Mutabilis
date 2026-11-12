import { API_URL } from "./config";
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
            const response = await fetch(`${API_URL}/api/v1/routine/get`,
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

    const handleProductSearch = async (productName) => {
        if (!productName || !productName.trim()) return
        try {
            const response = await fetch(
                `${API_URL}/api/v1/products/search?productName=${encodeURIComponent(productName)}`,
                { method: 'GET', headers: {'Authorization': `Bearer ${session.access_token}`} }
            )
            if (!response.ok) {
                console.log("Product search failed", response.status)
                setProductSearchArray([])
                return
            }
            const text = await response.text()
            setProductSearchArray(text ? JSON.parse(text) : [])
        } catch (error) {
            console.log(error)
            setProductSearchArray([])
        }
    }
    const handleProductEntry = async(productLog) => {
        const response = await fetch(`${API_URL}/api/v1/products/add`, {
            method: 'POST',
            headers: {'Authorization': `Bearer ${session.access_token}`,
                'Content-Type': 'application/json',},
            body: JSON.stringify(productLog)
        })
        if (!response.ok) {
            console.log("Product add failed", response.status)
            return []
        }
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
        const response = await fetch(`${API_URL}/api/v1/routine/add?${params.toString()}`, {
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
        const response = await fetch(`${API_URL}/api/v1/routine/update?${params.toString()}`, {
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
            await fetch(`${API_URL}/api/v1/routine/deleteRoutine?routineId=${routineId}`, {
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
    const timeButtons = (
        <div className="timeSetButtonContainer">
            <button className={`${timeButtonStyleOne}${parentIndex}`} onClick={() => {setRoutineTime("AM"); handleTimeButtonClick(1)}}>AM</button>
            <button className={`${timeButtonStyleTwo}${parentIndex}`} onClick={() => {setRoutineTime("PM"); handleTimeButtonClick(2)}}>PM</button>
            <button className={`${timeButtonStyleThree}${parentIndex}`} onClick={() => {setRoutineTime("AMPM"); handleTimeButtonClick(3)}}>AM&#183;PM</button>
        </div>
    )

    const routineNameField = (value, setValue) => (
        <div className="routineNameTextContainer">
            <p className="routineName">Routine Name</p>
            <input type="text" value={value} placeholder="e.g. Morning, Deep Cleanse..." className={`routineTextBox${parentIndex}`} onChange={(event) => setValue(event.target.value)}/>
        </div>
    )
    const productSearchRow = (
        <div className="routineProductSubmitContainerOuter">
            <div className="routineProductSubmitContainer">
                <div className="routineNameTextContainer">
                    <p className="productName">Product Name</p>
                    <input id="productNameEntry" type="text" className={`productEntryTextBox${parentIndex}`} value={productName} onChange={(event) => setProductName(event.target.value)} placeholder="e.g. Brand, Name on Label..."/>
                </div>
                <button className={`productSearchButton${parentIndex}`} onClick={() => {handleProductSearch(productName); setProductName("")}}>Search</button>
            </div>
            {productSearchArray.length > 0 ? (<hr className="subDividerThirteen" />) : null}
        </div>
    )

    const productSuggestions = (onPick) => productSearchArray.length > 0 ? (
        <div className="productSearchContainer">
            <p className="searchSuggestionsText">Search Suggestions:</p>
            {productSearchArray.map((product, index) => (
                <button key={index} className="productContainer" onClick={() => {onPick(product); setProductSearchArray([])}}>
                    <div className="individualProduct">
                        <div className="productAndBrandContainer">
                            <p className="individualProductName">{product.productName}</p>
                            <p className="productNameText">{product.brand}</p>
                        </div>
                        <p className="productNameText">{product.productCategory}</p>
                    </div>
                </button>
            ))}

            <button className="productContainer" onClick={() => {alert("Please type in the exact name with the brand."); setProductSearchArray([])}}>None of the Above</button>

        </div>
    ) : null

    const productList = (array, setArray, getLabel) => array.map((product, index) => (
        <div className="individualProductContainer" key={index}>
            <div className="listMoveAndIndexContainer">
                <div className="listMoveButtonContainer">
                    <button className={`moveListUpBotton${parentIndex}`} onClick={() => moveUp(index, array, setArray)} disabled={index === 0}>        <svg xmlns="http://www.w3.org/2000/svg" className={"chevronIcon chevronIconUp"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg></button>
                    <button className={`moveListUpBotton${parentIndex}`} onClick={() => moveDown(index, array, setArray)} disabled={index === array.length - 1}>        <svg xmlns="http://www.w3.org/2000/svg" className={"chevronIcon"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg></button>
                </div>
                <p className="addedProductName">{index + 1}. {getLabel(product)}</p>
            </div>
            <div className="listMoveAndRemoveButtonContainer">
                <button className={`deleteProductButton${parentIndex}`} onClick={() => removeProduct(index, array, setArray)}>X</button>
            </div>
        </div>
    ))

    return(
        <div className="routineContainer">
            <div className="routineTextDividerButtonContainer">
                <div className="routineButtonAndTextContainer">
                    <p className={`homePageRoutineText${parentIndex}`}>{routinePopUpState ? "New Routine" : savedRoutinePopUpState ? "Edit Routine" : "Routine"}</p>
                </div>
            </div>
            <div className="routineInnerContainer">
                {routinePopUpState ? (
                    <div className="routineInnerContainerForFlex">
                        <div className="routineInnerContainerWithoutButton">
                            <div className="routineContainerForGap">
                                <div className="routineFormIndividualContainer">
                                    <div className="routineNameContainer">
                                        {routineNameField(routineName, setRoutineName)}
                                        {timeButtons}
                                    </div>
                                    <hr className="subDividerEleven" />
                                </div>

                                {productSearchRow}
                                <div className="searchedProductArray">
                                    {productSuggestions((product) => {handleProductEntry(product); setProductArray(prev => [...prev, product.productName])})}
                                </div>

                            </div>

                            {productArray.length > 0 ? (
                                <div className="enteredProductArray">
                                    <p className="productListName">Product List</p>
                                    <div className="searchedProductArray">
                                        {productList(productArray, setProductArray, (product) => product)}
                                    </div>
                                </div>
                            ) : null}

                            <hr className="subDividerEleven"/>
                        </div>
                        <div>
                            <div className="submitChangesRoutineButtonContainer">
                                <div className="threeSplitDiv"></div>
                                <div className="threeSplitDivOne"><button className={`routineSubmitButton${parentIndex}`} onClick={() => {handleRoutineSubmit(); handleTimeButtonClick(4)}}>Submit</button></div>
                                <div className="threeSplitDiv">{routinePopUpState ? <button className={`cancelRoutineButton${parentIndex}`} onClick={() => {setRoutinePopUpState(false); setProductSearchArray([])}}>Cancel</button> : null}</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="savedRoutineContainer">
                        {savedRoutinePopUpState ? (
                            <div className="selectedRoutineContainer">
                                <div className="selectedRoutineAndCloseDropDownContainer">
                                    <div className="routineNameContainer">
                                        {routineNameField(editedRoutineName, setEditedRoutineName)}
                                        <div className="timeButtonsAndCloseRoutineButtonContainer">
                                            {timeButtons}
                                            <button className={`closeRoutinePopUpState${parentIndex}`} onClick={() => {setSavedRoutinePopUpState(false); setProductSearchArray([])}}><svg xmlns="http://www.w3.org/2000/svg" className={"chevronIcon chevronIconDown"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg></button>
                                        </div>
                                        </div>
                                </div>
                                <hr className="subDividerEleven" />
                                {productSearchRow}
                                <div className="searchedProductArray">

                                {productSuggestions(handleEditedProductEntry)}
                                </div>
                                <hr className="subDividerEleven" />
                                    <div className="enteredProductArray">
                                        <p className="productListName">Product List</p>
                                    <div className="searchedProductArray">
                                        {productList(editedProductArray, setEditedProductArray, (product) => product.productName)}
                                    </div>
                                </div>
                                <hr className="subDividerEleven" />
                                <div className="submitChangesRoutineButtonContainer">
                                    <div className="threeSplitDiv"></div>
                                    <div className="threeSplitDivOne"><button className="routineSubmitChangesButton" onClick={() => {handleEditedRoutineSubmit(editedProductArray, editedRoutineName, routineTime, routineIndex); setProductSearchArray([])}}>Save</button></div>
                                    <div className="threeSplitDiv"><button className={`routineDeleteButton${parentIndex}`} onClick={() => {handleRoutineDelete(routineId); setProductSearchArray([])}}>Delete Routine</button></div>


                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className={`savedRoutineInnerContainer${parentIndex}`}>
                                    {savedRoutineArray.map((routine, index) => (
                                        <div className="singleRoutineEntry"  key={routine.id}>
                                            <button disabled={!selectedRoutineArray.includes(routine.id) && selectedRoutineArray.length >= 2} className={selectedRoutineArray.includes(routine.id) ? "selectedRoutineButtonBlue" : "selectedRoutineButtonGray"} onClick={() => handleSelectedRoutineButton(routine.id)}>{selectedRoutineArray.includes(routine.id) ? (        <svg xmlns="http://www.w3.org/2000/svg" className="checkIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L18 5" /></svg>) : null}</button>
                                            <div className="selectRoutineAndRoutineNameContainer" onClick={() => {setRoutineIndex(index); setRoutineId(routine.id); setRoutineTime(routine.time); setEditedRoutineName(routine.name); setEditedProductArray(routine.products); setSavedRoutinePopUpState(true); handleTimeButtonClick(timeTranslator(routine.time))}}>
                                                <p className="savedRoutineText">{index + 1}. {routine.name} {routine.time}</p>
                                                <button className={`routineProductDropDownButton${parentIndex}`}><svg xmlns="http://www.w3.org/2000/svg" className={"chevronIcon chevronIconRight"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg></button>
                                            </div>


                                        </div>
                                    ))}
                                    <button className={`addRoutineButton${parentIndex}`} onClick={() => setRoutinePopUpState(true)}>+ Add Routine</button>
                                </div>

                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}