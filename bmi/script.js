        function calculateBMI() {
            const weight = parseFloat(document.getElementById('weight').value);
            const height = parseFloat(document.getElementById('height').value) / 100; // แปลงส่วนสูงเป็นเมตร

            if (!weight || !height || weight <= 0 || height <= 0) {
                alert('กรุณากรอกข้อมูลให้ถูกต้อง');
                return;
            }

            const bmi = weight / (height * height);
            const bmiValue = document.getElementById('bmiValue');
            const colorBar = document.getElementById('colorBar');
            const healthMessage = document.getElementById('healthMessage');

            bmiValue.textContent = bmi.toFixed(1);

            let category = '';
            let color = '';
            let message = '';

            if (bmi < 18.5) {
                category = 'น้ำหนักน้อย';
                color = '#74b9ff';
                message = 'คุณมีน้ำหนักน้อยกว่ามาตรฐาน\nแนะนำให้รับประทานอาหารที่มีคุณภาพและปรึกษาแพทย์';
            } else if (bmi < 23) {
                category = 'สุขภาพดี';
                color = '#00b894';
                message = 'ยินดีด้วย! คุณมีน้ำหนักอยู่ในเกณฑ์ปกติ\nรักษาสุขภาพด้วยการออกกำลังกายสม่ำเสมอ';
            } else if (bmi < 24.9) {
                category = 'น้ำหนักเกิน';
                color = '#fdcb6e';
                message = 'คุณมีน้ำหนักเกินเกณฑ์มาตรฐาน\nควรควบคุมอาหารและออกกำลังกายเพิ่มขึ้น';
            } else {
                category = 'อ้วน';
                color = '#ff7675';
                message = 'คุณอยู่ในเกณฑ์อ้วน\nควรปรึกษาแพทย์และควบคุมน้ำหนักอย่างเร่งด่วน';
            }

            colorBar.style.background = color;
            healthMessage.innerHTML = `<strong>${category}</strong><br>${message}`;
        }