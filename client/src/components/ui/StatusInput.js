
import React, { useState, useContext, useCallback } from 'react';
import styles from './checklist.module.css'
import SingleChecklist from './SingleChecklist';
import uniqueString from 'unique-string';

import { LoginUserContext } from '../../App';
import useLiveReload from '../request/useLiveReload';
import useRequest from '../request/useRequest';

//request: user ID, checklist
//response: user checklist, group quest
export default function StatusInput(props) {
    const [isInput, setInput] = useState(false);
    const [inputValue, setInputValue] = useState('Click to write a to-do');
    const {loginUser} = useContext(LoginUserContext);
    const [checklist, setChecklist] = useState({});
    const [quests, setQuests] = useState({});
    const [groupName, setGroupName] = useState('');
    const [acceptedQuests, setAcceptedQuests] = useState([]);
    
    let localChecklist = {};

    //**socket related functions**
    const onResponseOK = useCallback(({payload}) => {
        setChecklist(payload[0]);

    }, [setChecklist]);

    const onResponseFail = useCallback(({payload}) => {
        console.warn(payload.msg || "Failed to get infomation");
    }, []);

    const makePayload = useCallback(() => ({
        userID: loginUser.userID,
        updateChecklist: localChecklist
    }), [loginUser.userID, localChecklist]);

    const [request, innerReloadTimeRef] = useRequest({
        requestType: "REQUEST_PERSONAL_CHECKLIST",
        responseType: "RESPONSE_PERSONAL_CHECKLIST",
        onResponseOK,
        onResponseFail,
        makePayload
    });

    useLiveReload({request, innerReloadTimeRef});


    const mapChecklistsPersonal = () => {
        let returnComponents = [];
        for (let key in checklist) {
            let clist = checklist[key];
            returnComponents.push(
                <div className={styles.checklistBoxContainer}>
                    <SingleChecklist
                        key={clist.checklistID}
                        checklistID={clist.checklistID}
                        content={clist.content}
                        isDone={clist.isDone}
                        groupParticipation={''}
                    ></SingleChecklist>
                </div>
            )
        }

        return returnComponents.map(el => el)

    }

    const changeInputValue = (e) => {
        setInputValue(e.target.value);
    }

    const handleInput = () => {
        let updateList = {};
        const checklistKey = uniqueString();
        updateList[checklistKey] = {
            content: inputValue,
            isDone: false
        }
        localChecklist = {...updateList};
        setChecklist((checklist)=> ({...checklist, ...updateList}));
        setInputValue('Click to write a to-do');
        setInput(false);
        request();
    }

    return(
        <div className={styles.personalContainer}>
            {mapChecklistsPersonal()}
            <div className={styles.checklistBoxContainer}>
                <div className={styles.checklistBox} onClick = {()=>setInput(true)}>
                    <div className={styles.iconsLightGray}>add_circle_outline</div>
                    {!isInput &&
                        <div className={styles.checklistContentInput}>
                            Click to write a to-do
                        </div>
                    }
                    {isInput &&
                        <div className ={styles.inputContainer}>
                            <form className={styles.addChecklistContainer}>
                                <input
                                    type="text"
                                    autoFocus="true"
                                    className={styles.addChecklist}
                                    value={inputValue}
                                    onChange={changeInputValue}
                                ></input>
                            </form>
                            <div className = {styles.addButton} onClick={handleInput}>
                                Add
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}