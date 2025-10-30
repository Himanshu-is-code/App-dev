import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import type { Dispatch, SetStateAction } from 'react';
import { openDatabaseSync } from 'expo-sqlite';

// --- Database Setup ---
// It's important that both your calculator and history files use the exact same database name.
const db = openDatabaseSync('calculator-history.db');

// Get screen dimensions for responsive button sizing
const screen = Dimensions.get('window');
const buttonWidth = screen.width / 4;

export default function CalculatorScreen() {
  const [displayValue, setDisplayValue] = useState('0');
  const [operator, setOperator] = useState<string | null>(null);
  const [firstValue, setFirstValue] = useState('');
  const [isNewCalculation, setIsNewCalculation] = useState(true);

  // --- Database Function to Save Calculation ---
  // This function now accepts both the expression and the result.
  const saveCalculation = async (expression: string, result: string) => {
    try {
      // Ensure the table exists before trying to insert data.
      await db.execAsync(
        'CREATE TABLE IF NOT EXISTS history (id INTEGER PRIMARY KEY AUTOINCREMENT, expression TEXT, result TEXT);'
      );
      // Insert the new record into the history table.
      await db.runAsync('INSERT INTO history (expression, result) VALUES (?, ?);', [
        expression,
        result,
      ]);
      console.log(`Saved to history: ${expression} = ${result}`);
    } catch (error) {
      console.error('Error saving calculation:', error);
    }
  };

  // --- Calculator Logic ---

  const handleNumberInput = (num: number) => {
    // If we just finished a calculation, start a new number.
    if (isNewCalculation) {
      setDisplayValue(num.toString());
      setIsNewCalculation(false);
    } else if (displayValue === '0') {
      setDisplayValue(num.toString());
    } else {
      setDisplayValue(displayValue + num.toString());
    }
  };

  const handleOperatorInput = (op: string) => {
    // Handle chained operations like "5 * 5 + 2"
    if (operator && !isNewCalculation) {
      handleEqual(true); // isChainedOperation = true
    } else {
      setFirstValue(displayValue);
    }
    setOperator(op);
    setIsNewCalculation(true); // Ready for the next number to be typed.
  };

  const handleClear = () => {
    setDisplayValue('0');
    setOperator(null);
    setFirstValue('');
    setIsNewCalculation(true);
  };
  
  const handleDecimal = () => {
      if (!displayValue.includes('.')) {
          setDisplayValue(displayValue + '.');
      }
  };

  // --- MODIFIED handleEqual FUNCTION ---
  const handleEqual = (isChainedOperation = false) => {
    const first = parseFloat(firstValue);
    const second = parseFloat(displayValue);

    // Ensure we have valid numbers to work with
    if (isNaN(first) || isNaN(second) || !operator) {
      return;
    }

    let result = 0;
    
    // *** NEW: Construct the expression string here ***
    const expression = `${first} ${operator} ${second}`;

    if (operator === '+') result = first + second;
    else if (operator === '-') result = first - second;
    else if (operator === '*') result = first * second;
    else if (operator === '/') {
        if (second === 0) { // Handle division by zero
            setDisplayValue('Error');
            setOperator(null);
            setFirstValue('');
            setIsNewCalculation(true);
            return;
        }
        result = first / second;
    }

    const finalResult = parseFloat(result.toPrecision(12));
    const finalResultString = finalResult.toString();

    setDisplayValue(finalResultString);

    // Only save to history if it's the final calculation (user presses '='),
    // not part of a chained operation.
    if (!isChainedOperation) {
      // *** NEW: Pass the full expression to be saved ***
      saveCalculation(expression, finalResultString);
      setOperator(null);
    }

    setFirstValue(finalResultString); // The result becomes the new firstValue for potential future calculations.
    setIsNewCalculation(true);
  };

  const getButtonStyle = (type: 'operator' | 'utility' | 'number') => {
    if (type === 'operator') return styles.buttonAccent;
    if (type === 'utility') return styles.buttonSecondary;
    return styles.button;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.displayContainer}>
        <Text style={styles.displayText} adjustsFontSizeToFit numberOfLines={1}>
          {displayValue}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        {/* --- Button Rows --- */}
        <View style={styles.row}>
          <TouchableOpacity onPress={handleClear} style={[getButtonStyle('utility'), styles.button]}><Text style={styles.textSecondary}>AC</Text></TouchableOpacity>
          <TouchableOpacity style={[getButtonStyle('utility'), styles.button]}><Text style={styles.textSecondary}>+/-</Text></TouchableOpacity>
          <TouchableOpacity style={[getButtonStyle('utility'), styles.button]}><Text style={styles.textSecondary}>%</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => handleOperatorInput('/')} style={[getButtonStyle('operator'), styles.button]}><Text style={styles.text}>÷</Text></TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity onPress={() => handleNumberInput(7)} style={[getButtonStyle('number'), styles.button]}><Text style={styles.text}>7</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => handleNumberInput(8)} style={[getButtonStyle('number'), styles.button]}><Text style={styles.text}>8</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => handleNumberInput(9)} style={[getButtonStyle('number'), styles.button]}><Text style={styles.text}>9</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => handleOperatorInput('*')} style={[getButtonStyle('operator'), styles.button]}><Text style={styles.text}>×</Text></TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity onPress={() => handleNumberInput(4)} style={[getButtonStyle('number'), styles.button]}><Text style={styles.text}>4</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => handleNumberInput(5)} style={[getButtonStyle('number'), styles.button]}><Text style={styles.text}>5</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => handleNumberInput(6)} style={[getButtonStyle('number'), styles.button]}><Text style={styles.text}>6</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => handleOperatorInput('-')} style={[getButtonStyle('operator'), styles.button]}><Text style={styles.text}>-</Text></TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity onPress={() => handleNumberInput(1)} style={[getButtonStyle('number'), styles.button]}><Text style={styles.text}>1</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => handleNumberInput(2)} style={[getButtonStyle('number'), styles.button]}><Text style={styles.text}>2</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => handleNumberInput(3)} style={[getButtonStyle('number'), styles.button]}><Text style={styles.text}>3</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => handleOperatorInput('+')} style={[getButtonStyle('operator'), styles.button]}><Text style={styles.text}>+</Text></TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity onPress={() => handleNumberInput(0)} style={[getButtonStyle('number'), styles.button, styles.buttonDouble]}><Text style={styles.text}>0</Text></TouchableOpacity>
          <TouchableOpacity onPress={handleDecimal} style={[getButtonStyle('number'), styles.button]}><Text style={styles.text}>.</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => handleEqual()} style={[getButtonStyle('operator'), styles.button]}><Text style={styles.text}>=</Text></TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'flex-end' },
  displayContainer: { paddingHorizontal: 30, paddingBottom: 20, alignItems: 'flex-end' },
  displayText: { color: '#fff', fontSize: 96, fontWeight: '300' },
  buttonContainer: { paddingBottom: 30 },
  row: { flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 5 },
  button: { width: buttonWidth - 18, height: buttonWidth - 18, borderRadius: (buttonWidth - 18) / 2, backgroundColor: '#333', alignItems: 'center', justifyContent: 'center' },
  buttonDouble: { width: (buttonWidth * 2) - 27, alignItems: 'flex-start', paddingLeft: 35 },
  buttonAccent: { backgroundColor: '#f09a36' },
  buttonSecondary: { backgroundColor: '#a5a5a5' },
  text: { color: '#fff', fontSize: 38 },
  textSecondary: { color: '#000', fontSize: 32 },
});