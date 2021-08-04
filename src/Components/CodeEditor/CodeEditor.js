import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Styled = {
    CodeEditor: styled.div`
        display: flex;
        flex-flow: column;
        & h1 {
            margin: 0;
        }
        & textarea{
            height: 100%;
            resize: none;
        }
    `,
};

function CodeEditor(props) {
    const [code, setCode] = useState('');

    function handleTextChange(e) {
        setCode(e.target.value);
    }

    useEffect(() => {
        // If should transfer the code to the app
        if (props.shouldTransfer) {
            props.handleCodeTransfer(code, props.id);
        }
    }, [props.shouldTransfer]);

    return (
        <Styled.CodeEditor>
            <header>
                <h1>{ props.lang }</h1>
            </header>
            <textarea id={`${props.lang}-editor`} value={code} onChange={handleTextChange} />
        </Styled.CodeEditor>
    );
}

CodeEditor.propTypes = {
    id: PropTypes.number.isRequired,
    lang: PropTypes.string.isRequired,
    logo: PropTypes.element.isRequired,
    handleCodeTransfer: PropTypes.func.isRequired,
    shouldTransfer: PropTypes.bool.isRequired,
};

export default CodeEditor;
