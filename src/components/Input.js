import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
import PropTypes from 'prop-types';
//교재146

const StyledInput = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor: theme.main,
}))`
  // width: 100%;
  width: ${({ width }) => width - 40}px;
  height: 60px;
  margin: 3px;
  padding: 15px 20px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.itemBackground};
  font-size: 25px;
  color: ${({ theme }) => theme.text};
`;

const Input = ({
  placeholder,
  value,
  onChangeText,
  onSubmitEditing,
  onBlur,
}) => {
  const width = Dimensions.get('window').width;
  return (
    <StyledInput
      width={width}
      placeholder={placeholder}
      maxLength={50}
      autoCapitalize="none" //첫문자 대문자
      autoCorrect={false} //자동수정기능
      returnKeyType="done" //마지막키보드 완료버튼
      // keyboardAppearance="dark" //IOS에만 적용
      // secureTextEntry={true} 입력문자보호
      // multiline={true} //여러줄입력
      value={value}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      onBlur={onBlur}
    />
  );
};

//props속성의 타입과 필수여부체크
Input.prototypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  onSubmitEditing: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
};

export default Input;
