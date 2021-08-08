import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import CodeEditor from '../CodeEditor/CodeEditor';
import ResizeBar from '../ResizeBar/ResizeBar';

const paddingSize = 20;
const minSize = 0.4;

const Styled = {
    Editors: styled.div`
        background-color: rgb(0,70,70);
        color: white;
        padding: 0 ${paddingSize}px;

        display: grid;
        grid-template-columns:
        ${(props) => `${props.proportion[0]}fr auto
                      ${props.proportion[1]}fr auto
                      ${props.proportion[2]}fr`};
        justify-content: stretch;
    `,
};

function Editors({ transfer, onTransfer }) {
    const editors = useRef();
    const [sourceCodes, setSourceCodes] = useState(['', '', '']);
    const [editorsProportion, setEdProportion] = useState([1, 1, 1]);

    useEffect(() => {
        // Only when transfer is allowed
        if(transfer) {
            onTransfer(sourceCodes);
        }
    }, [transfer]);

    function changeSourceCode(code, id) {
        const newCode = sourceCodes.map((element, i) => (i === id ? code : element));
        setSourceCodes(newCode);
    }

    function handleProportionsChange(change, id) {
        // Calculate how much to slide
        const contentSize = editors.current.clientWidth - 2 * paddingSize;
        const normalizedChange = change / contentSize;

        const proportions = [...editorsProportion];

        // Verify if size will not suprass the min-width of the code editor
        for(let i = 0; i < 2; i++) {
            if(proportions[id + i] + (-1) ** i * normalizedChange < minSize) {
                proportions[id] = minSize;
                proportions[id + 1] = 2 - minSize;
                break;
            }
        }

        // Apply the slide
        proportions[id] += normalizedChange;
        proportions[id + 1] -= normalizedChange;
        setEdProportion(proportions);
    }

    function renderCodeEditors() {
        const list = [];
        const infos = [
            { lang: 'html', logo: null, id: 0 },
            { lang: 'css', logo: null, id: 1 },
            { lang: 'js', logo: null, id: 2 },
        ];
        infos.forEach((obj, index) => {
            list.push(
                <CodeEditor
                    key={obj.id}
                    id={obj.id}
                    lang={obj.lang}
                    code={sourceCodes[obj.id]}
                    logo={obj.logo}
                    onTextChange={changeSourceCode}
                />,
                (index < infos.length - 1) && (
                    <ResizeBar
                        key={obj.id + infos.length}
                        id={obj.id}
                        isVertical
                        onPropChange={handleProportionsChange}
                    />
                ),
            );
        });

        return list;
    }

    return (
        <Styled.Editors ref={editors} proportion={editorsProportion}>
            {renderCodeEditors()}
        </Styled.Editors>
    );
}

Editors.propTypes = {
    transfer: PropTypes.bool.isRequired,
    onTransfer: PropTypes.func.isRequired,
};

export default Editors;
