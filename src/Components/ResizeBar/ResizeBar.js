import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Styled = {
    ResizeBar: styled.div`
        z-index: 3;
        background-color: ${(props) => `rgb(${props.color[0]}, ${props.color[1]}, ${props.color[2]})`};
        width: ${(props) => (props.isVertical ? `${props.size}px` : '100%')};
        height: ${(props) => (props.isVertical ? '100%' : `${props.size}px`)};
        cursor: ${(props) => (props.isVertical ? 'ew-resize' : 'ns-resize')};

        &:active {
            outline: ${(props) => ` 3px solid rgb(${props.color[0]}, ${props.color[1]}, ${props.color[2]}, 0.7)`};
        }
    `,
};

function ResizeBar({
    id, isVertical, size, color, onPropChange,
}) {
    // 0: Click, 1: Resize, 2: Stop
    // const [resizeStage, setResizeStage] = useState(2);

    function handleMouseMove(e) {
        onPropChange(e.clientX, id);
    }

    function handleMouseUp() {
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('mousemove', handleMouseMove);
    }

    function handleMouseDown() {
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mousemove', handleMouseMove);
    }

    return (
        <Styled.ResizeBar
            isVertical={isVertical}
            size={size}
            color={color}
            onMouseDown={handleMouseDown}
        />
    );
}

ResizeBar.defaultProps = {
    size: 10,
    color: [200, 0, 200],
};

ResizeBar.propTypes = {
    id: PropTypes.number.isRequired,
    isVertical: PropTypes.bool.isRequired,
    size: PropTypes.number,
    color: PropTypes.array,
    onPropChange: PropTypes.func.isRequired,
};

export default ResizeBar;
