import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const borderSize = 8;

const Styled = {
    CodeEditor: styled.div`
        display: flex;
        flex-flow: column;
        padding: 10px;

        & header {
            background-color: rgb(20,21,28);
            border-top-left-radius: ${borderSize}px;
            border-top-right-radius: ${borderSize}px;
            padding: 3px 10px 0 10px;

            display: flex;
            align-items: center;
        }
        & h1 {
            margin: 0;
            user-select: none;
        }
        & img {
            height: 35px;
            width: auto;
            margin-right: 10px;
        }
        & .editor {
            border-bottom-left-radius: ${borderSize}px;
            border-bottom-right-radius: ${borderSize}px;
            width: 100%;
            height: 100%;
            overflow: hidden;

            display: flex;
        }
        & textarea{
            width: 100%;
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
                <img src={logo} alt="" />
                <h1>{ lang.toUpperCase() }</h1>
            </header>
            <div className="editor">
                <textarea
                    id={`${lang}-editor`}
                    value={code}
                    onChange={handleTextChange}
                />
            </div>
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
