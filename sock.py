import tkinter as tk
import socket
window=tk.Tk()
window.title("Network socket")
window.geometry("500x500")
window.configure(bg="blue")


frame=tk.Frame()
def sock():
    hosts=host.get()
    ports=int(port.get())
    sock=socket.socket(socket.AF_INET,socket.SOCK_STREAM)
    sock.connect((hosts,ports))
    message=f"GET/HTTP/1.1 200 OK\nHost:{hosts}:{ports}\r\nConnection:Close\r\n\r\n"
    sock.send(message.encode('utf_8'))
    banner=sock.recv(1024)
    output.insert(tk.END,f"from banner {hosts}:{ports}\n")
    output.insert(tk.END,banner.decode('utf_8'))
    output.insert(tk.END,f"\n...............")
tk.Label(frame,text="Network Socket").grid(row=0,column=1)
tk.Label(frame,text="HostName").grid(row=1,column=0)
host=tk.Entry(frame)
host.grid(row=1,column=1)
host.insert(0,"127.0.0.1")
tk.Label(frame,text="Port").grid(row=2,column=0)
port=tk.Entry(frame)
port.grid(row=2,column=1)
port.insert(0,"80")
tk.Button(frame,text="sock",command=sock).grid(row=3,column=1)
output=tk.Text(frame)
output.grid(row=4,column=1)
frame.pack()


window.mainloop()