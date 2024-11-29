from __future__ import print_function, division

import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
from torch.optim import lr_scheduler
import numpy as np
import torchvision
from torchvision import datasets, models, transforms
import matplotlib
import matplotlib.pyplot as plt
import time
import os
import copy
import PIL
from PIL import Image
import torch
import torch.nn as nn
import torch.optim as optim
from torch.optim import lr_scheduler
from os import listdir
from os.path import isfile, join
import glob
from torch.autograd import Variable
import torch.nn.functional as F
import platform, psutil
from datetime import date
import datetime, time
import sklearn.metrics as metrics
from sklearn.metrics import confusion_matrix
from sklearn.metrics import classification_report
import seaborn as sns
# plt.ion()


# 음식 양 추정 함수
def quantity(user_seq):
    # path = 'images/prediction/'+user_seq
    
    # data_transforms = {
    #         'test': transforms.Compose([
    #         transforms.RandomResizedCrop(224),
    #         transforms.RandomHorizontalFlip(),
    #         transforms.ToTensor(),
    #         transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])])}

    # data_dir = 'images'

    # path = {x: os.path.join(os.path.dirname(path)) for x in ['test']}
    # image_datasets = {x: datasets.ImageFolder(path[x], data_transforms[x]) for x in ['test']}
    
    # dataloaders = {'test' : torch.utils.data.DataLoader(image_datasets['test'], batch_size=84,shuffle=True, num_workers=4)}
    # dataset_sizes =  len(image_datasets['test'])

    # class_names = image_datasets['test'].classes
    # filenames = glob.glob('images/prediction/'+str(user_seq)+'/*')
    
    # filenames = glob.glob('/app/images/test/*/*.JPG') # 사진 위치

    # 양 추정 모델 불러오기
    def load_checkpoint(filepath, map_location='cpu'):
        checkpoint = torch.load(filepath, map_location='cpu')
        model = checkpoint['model_ft']
        model.load_state_dict(checkpoint['state_dict'], strict=False)
        model.class_to_idx = checkpoint['class_to_idx']
        optimizer_ft = checkpoint['optimizer_ft']
        epochs = checkpoint['epochs']

        for param in model.parameters(): 
            param.requires_grad = False

        return model, checkpoint['class_to_idx']

    device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
    map_location = 'cpu'
    ckpt = torch.load("weights/new_opencv_ckpt_b84_e200.pth",map_location="cpu")
    # ckpt = torch.load("/app/quantity_est/weights/new_opencv_ckpt_b84_e200.pth",map_location='cpu')
    ckpt.keys()

    # model, class_to_idx = load_checkpoint("/app/quantity_est/weights/new_opencv_ckpt_b84_e200.pth")
    model, class_to_idx = load_checkpoint("weights/new_opencv_ckpt_b84_e200.pth")

    image_size = 224
    norm_mean = [0.485, 0.456, 0.406]
    norm_std = [0.229, 0.224, 0.225]


    strict = False

    # device = torch.device('cpu')

    def predict2(image_path, model, topk=5):

        img = Image.open(image_path)
        img = process_image(img)

        img = np.expand_dims(img, 0)

        img = torch.from_numpy(img)

        model.eval()
        inputs = Variable(img).to(device)
        logits = model.forward(inputs)

        ps = F.softmax(logits, dim=1)
        topk = ps.cpu().topk(topk)

        return (e.data.numpy().squeeze().tolist() for e in topk)

    def process_image(image):
        preprocess = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406],
                                 std=[0.229, 0.224, 0.225])])
        image = preprocess(image)
        return image


    # path = './image/last/*/*' # 사진 형식 

    #path = '/home/ubuntu/quantity_est/images/test/*' # 사진 형식 


    
    def classPred(x, path_list):
        filename, Classes, Probs = [], [], []

        for i in range(x):
            probs, classes = predict2(path+path_list[i], model.to(device))
            output = [filename]

            output.append(classes)
            output.append(probs)
            Classes.append(classes) 
            Probs.append(probs)
            filename.append(path_list[i][:-4])

        return filename , Classes, Probs

    path = 'images/prediction/'+user_seq+"/"
    file_list = os.listdir(path)
    
    
    length = len(file_list)

    filename, Classes, Probs = classPred(length, file_list)

    cls_name = {'Q1': 0, 'Q2': 1, 'Q3':2, 'Q4':3, 'Q5': 4}
    name_cls = {0: 0.25, 1: 0.5, 2: 0.75, 3: 1, 4: 1.25}

    classes = []
    result = []

    for i in range(len(Classes)):
        classes.append(Classes[i][0]) 
        result.append(name_cls.get(Classes[i][0]))

    result_dict = {}
    
    for i in range(length):
        result_dict[filename[i]] = result[i]
    
    return result_dict

