import VerticalNavbar from './VerticalNavbar.jsx'
import './homepage.css'
import {Link} from 'react-router-dom'
import {useEffect, useState} from "react";


function HomePage({session}){

    const [routinePopUpState, setRoutinePopUpState] = useState(false)
    const [savedRoutinePopUpState, setSavedRoutinePopUpState] = useState(false)
    const [routineName, setRoutineName] = useState('')
    const [dayTimeCheckedState, setDayTimeCheckedState] = useState(false)
    const [stepCount, setStepCount] = useState(1)
    const [productArray, setProductArray] = useState([])
    const [productSearchArray, setProductSearchArray] = useState([])
    const [productName, setProductName] = useState('')
    const [routineTime, setRoutineTime] = useState('')
    const [routineIndex, setRoutineIndex] = useState(0);
    const [timeButtonStyleOne, setTimeButtonStyleOne] = useState("timeButtonStyleGray")
    const [timeButtonStyleTwo, setTimeButtonStyleTwo] = useState("timeButtonStyleGray")
    const [timeButtonStyleThree, setTimeButtonStyleThree] = useState("timeButtonStyleGray")
    const [productNamePlaceholder, setProductNamePlaceholder] = useState('')
    const [savedRoutineArray, setSavedRoutineArray] = useState([])
    const [editedProductArray, setEditedProductArray] = useState([])
    const [selectedRoutine, setSelectedRoutine] = useState("")
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
            setProductSearchArray([])
            setProductSearchArray(productionList)
        } else {
            setProductSearchArray([])
        }
    }
    const handleProductEntry = async(productName) => {
        await fetch(`http://localhost:8080/api/v1/products/add?productName=${productName}`, {
            method: 'POST',
            headers: {'Authorization': `Bearer ${session.access_token}`}
        })
        setProductArray([...productArray, productName]);
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

    const handleIdentifyProduct = async(productName) => {
        const response = await fetch(`http://localhost:8080/api/v1/products/addProduct?productName=${productName}`, {
            method: 'POST',
            headers: {'Authorization': `Bearer ${session.access_token}`}
        })
        return await response.json()
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
        else{
            setTimeButtonStyleOne("timeButtonStyleGray");
            setTimeButtonStyleTwo("timeButtonStyleGray");
            setTimeButtonStyleThree("timeButtonStyleBlue");
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


    return(
        <>
            <div className="screen">
                <VerticalNavbar />
                <div className="contentScreen">
                    <div className="contentContainer">
                        <div className="userInformationContainer">
                            <div className="userInformation">
                                <img className="profilePictureHomePage" src={session?.user?.user_metadata?.avatar_url}  alt="User Profile Picture"/>
                                <div className="messageContainer">
                                    <h2 className="welcomeMessage">Welcome!</h2>
                                    <h2 className="userName">{session.user.user_metadata.full_name}</h2>
                                </div>
                            </div>
                            <Link to="/track"><button className="trackPageRedirect">Today's Check In</button></Link>
                        </div>
                        <hr className="popUpDividerLineTwo"></hr>
                        <div className="routineAndNoteContainer">
                            <div className="routineContainer">
                                <div className="routineTextDividerButtonContainer">
                                    <div className="routineButtonAndTextContainer">
                                        <p className="homePageRoutineText">Routine</p>
                                        {routinePopUpState ? <button className="addRoutineButton" onClick={() => setRoutinePopUpState(false) }>x</button> : <button className="addRoutineButton" onClick={() => setRoutinePopUpState(true)}>+</button>}
                                    </div>
                                    <hr className="subDivider"></hr>
                                </div>
                                <div className="routineInnerContainer">
                                {routinePopUpState ? (
                                    <div className="routineInnerContainerForFlex">
                                        <div className="routineInnerContainerWithoutButton">
                                            <div>
                                                <div className="routineFormIndividualContainer">
                                                    <div className="routineNameContainer">
                                                        <input type="text" value={routineName} placeholder="Routine Name..." className="routineTextBox" onChange={(event) => {setRoutineName(event.target.value)}}/>
                                                        <div className="timeSetButtonContainer">
                                                            <button className={timeButtonStyleOne} onClick={() => {setRoutineTime("AM"); handleTimeButtonClick(1)}}>AM</button>
                                                            <button className={timeButtonStyleTwo} onClick={() => {setRoutineTime("PM"); handleTimeButtonClick(2)}}>PM</button>
                                                            <button className={timeButtonStyleThree} onClick={() => {setRoutineTime("AMPM"); handleTimeButtonClick(3)}}>AM&#183;PM</button>
                                                        </div>
                                                    </div>
                                                    <hr className="routineDivider"></hr>
                                                </div>
                                                <div className="routineProductSubmitContainer">
                                                    <input id="productNameEntry" type ="text" className="productEntryTextBox" value={productName} onChange={(event) => setProductName(event.target.value)}  placeholder="Product Name..."/>
                                                    <button className="productSearchButton" onClick={() => {handleProductSearch(productName); setProductNamePlaceholder(productName); setProductName("")}}>Search</button>
                                                </div>
                                                {productSearchArray.length > 0 ? (
                                                    <div className="productSearchContaienr">
                                                        <p>Is It?</p>
                                                        {productSearchArray.map(product => <button className="productContainer" onClick={() => {setProductArray([...productArray, product.productName]); setProductSearchArray([])}}>{product.productName} &#183; {product.brand} &#183; {product.productCategory}</button>)}
                                                        <button className="productContainer" onClick={() => {handleProductEntry(productNamePlaceholder); if(!(productArray.includes(productNamePlaceholder))){setProductArray([...productArray, productNamePlaceholder]); setProductSearchArray([])}}}>None of the Above</button>
                                                    </div>
                                                ) : null
                                                }
                                                <hr className="subDivider"></hr>
                                            </div>
                                            <div className="enteredProductArray">
                                                {productArray.map((product, index) => (
                                                    <div className="individualProductContainer">
                                                        <div className="listMoveAndIndexContainer">
                                                            <div className="listMoveButtonContainer">
                                                                <button className="moveListUpBotton" onClick={() => moveUp(index, productArray, setProductArray)} disabled={index === 0}>&#8963;</button>
                                                                <button className="moveListUpBotton" onClick={() => moveDown(index, productArray, setProductArray)} disabled={index === productArray.length - 1}>&#8964;</button>
                                                            </div>
                                                            <p className="addedProductName">{index + 1}. {product}</p>
                                                        </div>
                                                        <div className="listMoveAndRemoveButtonContainer">
                                                            <button className="deleteProductButton" onClick={() => removeProduct(index, productArray, setProductArray)}>X</button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div></div>
                                        <div>
                                            <div className="routineSubmitButtonContainer">
                                                <button className="routineSubmitButton" onClick={() => handleRoutineSubmit()}>Submit</button>
                                            </div>
                                        </div>
                                    </div>)




                                    :




                                    (<div className="savedRoutineContainer">
                                        {savedRoutinePopUpState ? (
                                                <div>
                                                    <div className="selectedRoutineAndCloseDropDownContainer">
                                                        <div className="routineNameContainer">
                                                            <input type="text" value={editedRoutineName} placeholder={editedRoutineName} className="routineTextBox" onChange={(event) => {setEditedRoutineName(event.target.value)}}/>
                                                            <div className="timeSetButtonContainer">
                                                                <button className={timeButtonStyleOne} onClick={() => {setRoutineTime("AM"); handleTimeButtonClick(1)}}>AM</button>
                                                                <button className={timeButtonStyleTwo} onClick={() => {setRoutineTime("PM"); handleTimeButtonClick(2)}}>PM</button>
                                                                <button className={timeButtonStyleThree} onClick={() => {setRoutineTime("AMPM"); handleTimeButtonClick(3)}}>AM&#183;PM</button>
                                                            </div>
                                                        </div>
                                                        <button onClick={() => setSavedRoutinePopUpState(false)}>&#8963;</button>
                                                    </div>


                                                    <div className="routineProductSubmitContainer">
                                                        <input id="productNameEntry" type ="text" className="productEntryTextBox" value={productName} onChange={(event) => setProductName(event.target.value)}  placeholder="Product Name..."/>
                                                        <button className="productSearchButton" onClick={() => {handleProductSearch(productName); setProductNamePlaceholder(productName); setProductName("")}}>Search</button>
                                                    </div>

                                                    {productSearchArray.length > 0 ? (
                                                        <div className="productSearchContaienr">
                                                            <p>Is It?</p>
                                                            {productSearchArray.map(product => <button className="productContainer" onClick={() => {setEditedProductArray(prev => [...prev, {productId: product.id, productName: product.productName}]); setProductSearchArray([])}}>{product.productName} &#183; {product.brand} &#183; {product.productCategory}</button>)}
                                                            <button className="productContainer" onClick={async() => {
                                                                const product = await handleIdentifyProduct(productNamePlaceholder)
                                                                if(!product) return;
                                                                setEditedProductArray(prev =>
                                                                    prev.some(p => p.productId === product.id)
                                                                        ? prev
                                                                        : [...prev, { productId: product.id, productName: product.productName}]
                                                                )
                                                                setProductSearchArray([])
                                                            }}>None of the Above</button>
                                                        </div>
                                                    ) : null
                                                    }
                                                    <div>
                                                        {editedProductArray.map((product, index) => (
                                                            <div className="individualProductContainer">
                                                                <div className="listMoveAndIndexContainer">
                                                                    <div className="listMoveButtonContainer">
                                                                        <button className="moveListUpBotton" onClick={() => moveUp(index, editedProductArray, setEditedProductArray)} disabled={index === 0}>&#8963;</button>
                                                                        <button className="moveListUpBotton" onClick={() => moveDown(index, editedProductArray, setEditedProductArray)} disabled={index === editedProductArray.length - 1}>&#8964;</button>
                                                                    </div>
                                                                    <p className="addedProductName">{index + 1}. {product.productName}</p>
                                                                </div>
                                                                <div className="listMoveAndRemoveButtonContainer">
                                                                    <button className="deleteProductButton" onClick={() => removeProduct(index, editedProductArray, setEditedProductArray)}>X</button>
                                                                </div>
                                                            </div>

                                                        ))}
                                                    </div>
                                                    <button onClick={() => handleEditedRoutineSubmit(editedProductArray, editedRoutineName, routineTime, routineIndex)}>Submit Changes</button>
                                                </div>) : (
                                            <div className="savedRoutineInnerContainer">
                                            {savedRoutineArray.map((routine, index) => (
                                                        <div className="singleRoutineEntry" key={routine.id}>
                                                            <p className="savedRoutineText">
                                                                {index + 1}. {routine.name} {routine.time}
                                                            </p>
                                                            <button className="routineProductDropDownButton" onClick={() => {setRoutineIndex(index); setRoutineId(routine.id); setRoutineTime(routine.time); setSelectedRoutine(routine); setEditedRoutineName(routine.name); setEditedProductArray(routine.products); setSavedRoutinePopUpState(true); handleTimeButtonClick(timeTranslator(routine.time))}}>&#8964;</button>
                                                        </div>
                                                    ))}
                                            </div>
                                        )}
                                    </div>)
                                }
                                </div>
                            </div>
                            <div className="noteContainer">
                            <p className="homePageRoutineText">Notes</p>
                                <div>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
        )

}
export default HomePage;