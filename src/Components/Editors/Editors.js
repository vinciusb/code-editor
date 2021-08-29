import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import htmlIcon from './logos/html.png';
import cssIcon from './logos/css.png';
import jsIcon from './logos/js.png';

import CodeEditor from '../CodeEditor/CodeEditor';
import ResizeBar from '../ResizeBar/ResizeBar';

// Consts values
const paddingSize = 20;
const minSize = 0.4;
const resBarSize = 2;
const edInfos = [
    {
        lang: 'xml', title: 'html', logo: htmlIcon, id: 0,
    },
    {
        lang: 'css', title: 'css', logo: cssIcon, id: 1,
    },
    {
        lang: 'javascript', title: 'js', logo: jsIcon, id: 2,
    },
];
const startText = [
    '<h1 class="muda-cor">MUDO DE COR</h1>',
    `h1 {
        font-size: 24px;
        transition: color 1s ease-out;
    }`,
    `const h1 = document.getElementsByClassName('muda-cor')[0];
let mode = false;
        
setInterval(() => {
    const color = mode ? '#AA00AA' : '#AAAA00';
        mode = !mode;
        h1.style.color = color;
}, 1000);`,
];

const Styled = {
    Editors: styled.div`
        background-color: rgb(40,42,53);
        color: white;
        padding: 0 ${paddingSize}px;
        user-select: none;
        height: 100%;

        display: grid;
        grid-template-columns: ${({ p, w }) => {
        const sum = p[0] + p[1] + p[2];
        return `${(p[0] / sum) * w}px ${resBarSize}px ${(p[1] / sum) * w}px ${resBarSize}px ${(p[2] / sum) * w}px`;
    }};
    `,
};
// e.target.innerWidth
function Editors({ transfer, onTransfer, w }) {
    const editors = useRef(0);
    const [edW, setEdW] = useState(0);
    const [sourceCodes, setSourceCodes] = useState(startText);
    const [editorsProportion, setEdProportion] = useState({
        p: [1, 1, 1],
        lastId: 0,
    });

    useEffect(() => {
        setEdW(w - 2 * paddingSize - 2 * resBarSize);
    }, [w]);

    useEffect(() => {
        // Only when transfer is allowed
        if(transfer) {
            onTransfer(sourceCodes);
        }
    }, [transfer]);

    function changeSourceCode(text, id) {
        const newCode = sourceCodes.map((element, i) => (i === id ? text : element));
        setSourceCodes(newCode);
    }

    function handleProportionsChange(mouse, id) {
        const start = id === 0 ? 0 : editorsProportion.p[0];

        // Mouse and Content size ignoring padding
        const contentSize = editors.current.clientWidth - 2 * paddingSize;
        const mouseInsideDiv = mouse - paddingSize;
        const normalizedMouse = 3 * (mouseInsideDiv / contentSize) - start;

        // Copy proportions
        const proportions = [...editorsProportion.p];

        const totalSize = proportions[id] + proportions[id + 1];

        proportions[id] = normalizedMouse;
        proportions[id + 1] = totalSize - normalizedMouse;

        // Garants Min size: 0: 0-1 / 1: 1-0
        for(let i = 0; i < 2; i++) {
            if(proportions[id + i] < minSize) {
                proportions[id + i] = minSize;
                proportions[id + 1 - i] = totalSize - minSize;
                break;
            }
        }

        setEdProportion({ p: proportions, lastId: id });
    }

    function renderCodeEditors() {
        const list = [];
        edInfos.forEach((obj, index) => {
            list.push(
                <CodeEditor
                    key={obj.id}
                    id={obj.id}
                    title={obj.title}
                    lang={obj.lang}
                    code={sourceCodes[obj.id]}
                    logo={obj.logo}
                    onTextChange={changeSourceCode}
                    font="monospace"
                    size={15}
                />,
                (index < edInfos.length - 1) && (
                    <ResizeBar
                        key={obj.id + edInfos.length}
                        id={obj.id}
                        size={resBarSize}
                        isVertical
                        onPropChange={handleProportionsChange}
                    />
                ),
            );
        });

        return list;
    }

    return (
        <Styled.Editors
            ref={editors}
            p={editorsProportion.p}
            w={edW}
            fontSize={16}
        >
            {renderCodeEditors()}
        </Styled.Editors>
    );
}

Editors.propTypes = {
    transfer: PropTypes.bool.isRequired,
    onTransfer: PropTypes.func.isRequired,
    w: PropTypes.number.isRequired,
};

export default Editors;
