function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.display = 'block'; // Show it instantly

    // Automatically hide it after 3 seconds
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}