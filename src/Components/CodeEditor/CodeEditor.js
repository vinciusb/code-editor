import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Styled = {
    CodeEditor: styled.div`
        display: flex;
        flex-flow: column;
        padding: 10px;

        & h1 {
            margin: 0;
            user-select: none;
        }
        & textarea{
            height: 100%;
            resize: none;
        }
        & textarea:focus {
            outline: none;
        }
    `,
};

function CodeEditor({
    id, lang, code, logo, onTextChange,
}) {
    function handleTextChange(e) {
        onTextChange(e.target.value, id);
    }

    return (
        <Styled.CodeEditor>
            <header>
                <h1>{ lang.toUpperCase() }</h1>
            </header>
            <textarea id={`${lang}-editor`} value={code} onChange={handleTextChange} />
        </Styled.CodeEditor>
    );
}

CodeEditor.propTypes = {
    id: PropTypes.number.isRequired,
    lang: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    logo: PropTypes.element.isRequired,
    onTextChange: PropTypes.func.isRequired,
};

export default CodeEditor;
