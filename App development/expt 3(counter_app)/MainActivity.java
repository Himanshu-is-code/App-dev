import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

public class MainActivity extends AppCompatActivity {

    // 1. Declare variables for the UI elements and the counter
    private TextView counterTextView;
    private Button incrementButton;
    private Button resetButton;
    private int count = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main); // Links this Java file to the XML layout

        // 2. Find the UI elements by their ID from the XML and link them to our variables
        counterTextView = findViewById(R.id.counterTextView);
        incrementButton = findViewById(R.id.incrementButton);
        resetButton = findViewById(R.id.resetButton);

        // 3. Set a click listener for the increment button
        incrementButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // This code runs when the increment button is clicked
                count++; // Increase the count by 1
                counterTextView.setText(String.valueOf(count)); // Update the TextView
            }
        });

        // 4. Set a click listener for the reset button
        resetButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // This code runs when the reset button is clicked
                count = 0; // Reset the count to 0
                counterTextView.setText(String.valueOf(count)); // Update the TextView
            }
        });
    }
}