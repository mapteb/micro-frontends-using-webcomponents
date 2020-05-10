/*	
unknownState                    - onload     - processOnload     - onloadSuccess                 - readyForAdd 
readyForAdd                     - addTodo    - processAddTodo    - addTodoSuccessNoneSelected    - readyForAddSelect
readyForAddSelect               - addTodo    - processAddTodo    - addTodoSuccessNoneSelected    - readyForAddSelect
readyForAddSelect               - changeTodo - processChangeTodo - changeTodoSuccessSomeSelected - readyForAddSelectUnselectDelete 
readyForAddSelect               - changeTodo - processChangeTodo - changeTodoSuccessAllSelected  - readyForAddUnselectDelete												
readyForAddUnselectDelete       - addTodo    - processAddTodo    - addTodoSuccessSomeSelected    - readyForAddSelectUnselectDelete
readyForAddUnselectDelete       - changeTodo - processchangeTodo - changeTodoSuccessNoneSelected - readyForAddSelect
readyForAddUnselectDelete       - changeTodo - processchangeTodo - changeTodoSuccessSomeSelected - readyForAddSelectUnselectDelete
readyForAddUnselectDelete       - deleteTodo - processDeleteTodo - deleteTodoSuccessAllDeleted   - readyForAdd											 
readyForAddSelectUnselectDelete - addTodo    - processAddTodo    - addTodoSuccessSomeSelected    - readyForAddUnselectDelete
readyForAddSelectUnselectDelete - changeTodo - processChangeTodo - changeTodoSuccessAllSelected  - readyForAddUnselectDelete
readyForAddSelectUnselectDelete - changeTodo - processChangeTodo - changeTodoSuccessSomeSelected - readyForAddSelectUnselectDelete															 
readyForAddSelectUnselectDelete - changeTodo - processChangeTodo - changeTodoSuccessNoneSelected - readyForAddSelect
readyForAddSelectUnselectDelete - changeTodo - processChangeTodo - changeTodoSuccessSomeSelected - readyForAddSelectUnselectDelete															 
readyForAddSelectUnselectDelete - deleteTodo - processDeleteTodo - deleteTodoSuccessNoneSelected - readyForAddSelect
*/

const appData = {
    maxId: function () {
        let data = document.getElementById("changeTodo").getAttribute("data-response");
        if (data.length > 0) {
            return JSON.parse(data).maxId;
        }
        return 0;
    },
    selectedCount: function () {
        return appData.selectedItems().length;
    },
    itemsCount: function () {
        let data = JSON.parse(document.getElementById("changeTodo").getAttribute("data-response"));
        return data.itemsCount;
    },
    selectedItems: function () {
        let data = JSON.parse(document.getElementById("changeTodo").getAttribute("data-response"));
        return data.selectedItems;
    }
};

const appStates = {
    readyForAdd: function (e) {

        document.getElementById("addTodoView").style.display = "block";
        document.getElementById("changeTodoView").style.display = "none";
        document.getElementById("deleteTodoView").style.display = "none";
        document.getElementById("currentState").innerHTML = e.type + ' => readyForAdd';
    },
    readyForAddSelect: function (e) {
        document.getElementById("addTodo").getElementsByTagName("input")[0].value = "";
        document.getElementById("addTodo").getElementsByTagName("input")[0].focus();
        document.getElementById("addTodoView").style.display = "block";
        document.getElementById("changeTodoView").style.display = "block";
        document.getElementById("deleteTodoView").style.display = "none";
        document.getElementById("currentState").innerHTML = e.type + ' => readyForAddSelect';
    },
    readyForAddUnselectDelete: function (e) {
        document.getElementById("addTodoView").style.display = "block";
        document.getElementById("changeTodoView").style.display = "block";
        document.getElementById("deleteTodoView").style.display = "block";
        document.getElementById("currentState").innerHTML = e.type + ' => readyForAddUnselectDelete';
    },
    readyForAddSelectUnselectDelete: function (e) {
        document.getElementById("addTodo").getElementsByTagName("input")[0].value = "";
        document.getElementById("addTodo").getElementsByTagName("input")[0].focus(); document.getElementById("addTodoView").style.display = "block";
        if (appData.itemsCount() > 0) document.getElementById("changeTodoView").style.display = "block";
        else document.getElementById("changeTodoView").style.display = "none";
        document.getElementById("deleteTodoView").style.display = "block";
        document.getElementById("currentState").innerHTML = e.type + ' => readyForAddSelectUnselectDelete';
    }

};

const appEvents = {
    onload: {
        process: function (e, handlePostEvent) {
            //for onload just ceate a new input textbox element
            const data = { name: "addTodo", action: "create", todoText: "" };
            let el = document.getElementById("addTodo");
            el.setAttribute("data-request", JSON.stringify(data));
            handlePostEvent(new CustomEvent('onloadSuccess'));
        }
    },
    onloadSuccess: {
        nextState: function (e) {
            return appStates.readyForAdd(e);
        }
    },
    addTodo: {
        process: function (e, handlePostEvent) {

            //user entered a todo text, create a new input checkbox element
            let el = document.getElementById("changeTodo");
            let maxId = appData.maxId() + 1;
            let data = { name: "changeTodo", value: maxId, action: "create", todoText: e.detail.value };
            el.setAttribute("data-request", JSON.stringify(data));

            //determine whether none selected or some selected
            let evttype = '';
            if (appData.selectedCount() > 0 &&
                appData.itemsCount() - appData.selectedCount() > 0) {
                evttype = 'addTodoSuccessSomeSelected';
            } else {
                evttype = 'addTodoSuccessNoneSelected';
            }

            handlePostEvent(new CustomEvent(evttype));
        }
    },
    addTodoSuccessNoneSelected: {
        nextState: function (e) {
            return appStates.readyForAddSelect(e);
        }
    }
    ,
    addTodoSuccessSomeSelected: {
        nextState: function (e) {
            return appStates.readyForAddSelectUnselectDelete(e);
        }
    },
    changeTodo: {
        process: function (e, handlePostEvent) {
            let selectedItem = e.detail.value
            let evttype = '';
            console.log(">>> selected value: ", selectedItem);
            //if checked then create a delete button
            if (selectedItem != null) {
                let data = { name: "deleteTodo", value: "Delete" };
                document.getElementById("deleteTodo").setAttribute("data-request", JSON.stringify(data));

                //update the selectedCount
                data = { name: "changeTodo", action: "update", value: Number(selectedItem) };
                //consol.log(">>> data: ", data);
                document.getElementById("changeTodo").setAttribute("data-request", JSON.stringify(data));
            }
            //now determine whether none selected, some selected or all selected
            if (appData.selectedCount() > 0) {
                if (appData.selectedCount() == appData.itemsCount()) {
                    evttype = 'changeTodoSuccessAllSelected';
                } else if (appData.itemsCount() - appData.selectedCount() > 0) {
                    evttype = 'changeTodoSuccessSomeSelected';
                }
            } else {
                evttype = 'changeTodoSuccessNoneSelected';
            }

            handlePostEvent(new CustomEvent(evttype));
        }
    },
    changeTodoSuccessSomeSelected: {
        nextState: function (e) {
            return appStates.readyForAddSelectUnselectDelete(e);
        }
    },
    changeTodoSuccessAllSelected: {
        nextState: function (e) {
            return appStates.readyForAddUnselectDelete(e);
        }
    },
    changeTodoSuccessNoneSelected: {

        nextState: function (e) {
            return appStates.readyForAddSelect(e);
        }
    },
    deleteTodo: {
        process: function (e, handlePostEvent) {
            //delete selected items
            let data = { name: "changeTodo", action: "delete", values: appData.selectedItems() };
            console.log(">>> data: ", appData.selectedItems());
            document.getElementById("changeTodo").setAttribute("data-request", JSON.stringify(data));

            //determine whether none selected or all deleted
            let evttype = '';
            if (appData.itemsCount() > 0 &&
                appData.selectedCount() == 0) {
                evttype = 'deleteTodoSuccessNoneSelected';
            }
            else evttype = 'deleteTodoSuccessAllDeleted';
            handlePostEvent(new CustomEvent(evttype));
        }

    },
    deleteTodoSuccessNoneSelected: {
        nextState: function (e) {
            return appStates.readyForAddSelect(e);
        }
    },

    deleteTodoSuccessAllDeleted: {
        nextState: function (e) {
            return appStates.readyForAdd(e);
        }
    }
};

function handleAppEvent(customEventName, eventDta) {

    //receive the document onload event
    appEventHelper(customEventName, eventDta);

    //receive the input textbox event
    document.getElementById("addTodo").addEventListener('change', e => {
        appEventHelper('addTodo', e.target.value);
    });

    //receive the checkbox event
    document.getElementById("changeTodo").addEventListener('change', e => {
        appEventHelper('changeTodo', e.target.value);
    });

    //receive the button event
    document.getElementById("deleteTodo").addEventListener('click', e => {
            appEventHelper('deleteTodo', e.target.value);
    });
};

function appEventHelper(customEventName, eventDta){
    let todoEvent = new CustomEvent(customEventName, {
                detail: {
                    value: eventDta
                }
            });
    stateTransitionsManager(todoEvent);
}

function stateTransitionsManager(todoEvent) {
    appEvents[todoEvent.type].process(todoEvent, handlePostEvent);
}

function handlePostEvent(e) {
    appEvents[e.type].nextState(e);
}

