let React = {
    createElement: (tag, props, ...children) => {
        if (typeof tag == "function") {
            try {
                return tag(props)
            } catch ({ promise, key }) {
                promise.then(data => {
                    promiseCache.set(key, data)
                    rerender()
                })
                return { tag: 'div', props: { children: ["loading"] } }
            }
        }
        var element = { tag, props: { ...props, children } }
        return element
    }
}


const states = []
let stateCursor = 0;

const useState = (initialState) => {
    let FRONZENCURSOR = stateCursor;
    states[FRONZENCURSOR] = states[FRONZENCURSOR] || initialState;
    const setState = newState => {
        // console.log(states)
        states[FRONZENCURSOR] = newState;
        rerender();
    }
    stateCursor++

    return [states[FRONZENCURSOR], setState]
}
const rerender = () => {
    stateCursor = 0;
    document.querySelector("#app").firstChild.remove();
    render(<App />, document.getElementById("app"));
}

const promiseCache = new Map();
const createResource = (appPromise, key) => {
    if (promiseCache.has(key)) {
        return promiseCache.get(key)
    }

    throw { promise: appPromise(), key }
}

const App = () => {
    const [newName, setNewName] = useState("bayo")
    const [count, setCount] = useState(0)
    const dogPhotosUrl = createResource(() => fetch('https://dog.ceo/api/breeds/image/random').then(r => r.json()).then(payload => payload.message), "pictures")
    return (

        <div className="react-2020">
            <h1>
                welcome , {newName}!
            </h1>
            <input value={newName} onchange={e => setNewName(e.target.value)} type="text" placeholder="username" />
            <h2>the count of {count}</h2>
            <button onclick={() => setCount(count + 1)}>+</button>
            <button onclick={() => setCount(count - 1)}>-</button>
            <img src={dogPhotosUrl} alt="dopphoto" />

            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Maiores atque laborum quia repellendus deserunt! Inventore quas odit veniam omnis quia.</p>
        </div>
    )
}

const render = (reactElementOrStringOrNumber, container) => {
    if (['string', 'number'].includes(typeof reactElementOrStringOrNumber)) {
        console.log("stringornumber", reactElementOrStringOrNumber)
        container.appendChild(document.createTextNode(String(reactElementOrStringOrNumber)))
        return
    }
    const actualDomElement = document.createElement(reactElementOrStringOrNumber.tag);
    if (reactElementOrStringOrNumber.props) {
        Object.keys(reactElementOrStringOrNumber.props).filter(p => p !== "children").forEach(p => actualDomElement[p] = reactElementOrStringOrNumber.props[p])
    }
    if (reactElementOrStringOrNumber.props.children) {
        reactElementOrStringOrNumber.props.children.forEach(child => render(child, actualDomElement))
    }
    container.appendChild(actualDomElement)
}
render(<App />, document.getElementById("app"));

// const a = React.createElement('div', null , "hello")